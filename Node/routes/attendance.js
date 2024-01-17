// routes/attendance.js

const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Attendance = require("../models/attendanceModel");
const staff = require("../models/staffModel");
const Student = require("../models/studentModel");
const multer=require("multer")
const path=require("path")
const axios=require("axios")
const fs=require("fs")
  const staffStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./verify/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}` + ".jpg");
    },
  });
  const uploadVerify= multer({ storage: staffStorage });
const secretKey = process.env.SECRET; // Replace with a secure secret key
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!req.session.token || !req.session.userId) {
    return res.status(401).json({ error: "No user Logged in" });
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    req.session.user=user

    next();
  });
}

router.post("/login", async (req, res) => {
  const { name } = req.body;

  try {
    if(!name){
      throw new Error("Input lecturer's name")
    }
    const existingUser = await staff.findOne({ name });

    if (!existingUser) {
      throw new Error("User does not exist");
    }

    // Check if the user is already logged in
    if (req.session.userId) {
      throw new Error("User is already logged in");
    }

    // Assuming you want to include some user information in the token
    const token = jwt.sign(
      { userId: existingUser._id, username: existingUser.name },
      secretKey
    );
    console.log(token);
    req.session.token = token;
    req.session.userId = existingUser._id;

    const responseUser = {
      ...existingUser.toObject(), // This spreads existingUser properties
      token,
    };

    res.status(200).json({ user: responseUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error({ error: error.message });
  }
});

router.post("/logout", authenticateToken, (req, res) => {
  try {
    // Clear user-related information from the session
    req.session.token = null;
    req.session.userId = null;

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error({ error: error.message });
  }
});

router.post("/start/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { course, timeout } = req.body;

  try {
    if (!course) {
      throw new Error(" course is not provided");
    }
    const exist = await staff.findById({ _id: id });
    if (exist) {
      const students = await Student.find({ courses: course });
      const existingAttendance = await Attendance.findOne({
        course,
        date: new Date().toISOString().split("T")[0],
      });
      if (existingAttendance) {
        throw new Error(
          `Attendance already exist for ${course} on ${
            new Date().toISOString().split("T")[0]
          }`
        );
      }
      if (students.length > 0) {
        for (const stud of students) {
          const attend = await Attendance.create({
            student: stud.name,
            matricno: stud.matricno,
            imagename: stud.imagename,
            date: new Date().toISOString().split("T")[0],
            time: new Date().toISOString().split("T")[1].split(".")[0],

            status: "absent",
            course,
          });
        }
        req.session.course = course;
        res
          .status(200)
          .json({ message: "Attendance records created successfully" });
        // abort(timeout)
      } else {
        throw Error(`You do not have any student registered for ${course}`);
      }
    } else {
      throw Error("You are not Authorized");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log({ error: error.message });
  }
});
router.post("/update",authenticateToken,uploadVerify.single("image"), async (req, res) => {
  try {
  if(!req.file){
        throw new Error("Input an image")
      }
  const imagePath = path.join(__dirname, "../verify", req.file.filename); 
    // console.log(req.file)
    const body = {
      image_path: imagePath
    };
    console.log(body)
      
      let studentId = "STA222009";	
      // course="IPE501"
      const course=req.session.course
      console.log(course);   

      try {
      // console.log(req.file.path)
      const response = await axios.post(
        "http://127.0.0.1:5000/detect",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
        fs.unlink(imagePath,(err)=>{
          if (err)throw err
          console.log(`${imagePath} deleted`)
        })
      if (!response.data.success) {
        throw new Error(response.data.message);
      } else {
        console.log(response.data.id)
        studentId = response.data.id;
        const id=`${studentId.slice(0,3).toUpperCase()}/${studentId.slice(3,5)}/${studentId.slice(5,)}`
        const match=id.match(/\w{3}\/\d{2}\/\d{4}/g)
console.log(id)   
console.log(course)   
if(!id||!course){
  throw new Error("Server error:input not complete")
}
if(!match){
  throw new Error("Invalid matric number")
}     
        let student = await Student.findOne({ matricno:id });
        if (!student){
          throw new Error ("Student does not exist in database")
        }
        const existingAttendance = await Attendance.findOne({
          student: student.name,
          course,
          date: new Date().toISOString().split("T")[0],
        });
    
        if (existingAttendance) {
          const marked = await Attendance.findOne({
            student: student.name,
            course,
            status:"present",
            date: new Date().toISOString().split("T")[0],
          });
          if(marked){
            throw new Error(`${marked.name} already marked ${marked.status}`)
          }
          const update = await Attendance.findOneAndUpdate(
            { _id: existingAttendance._id },
            { status: "present", time: new Date().toISOString().split("T")[1].split(".")[0] }
          );
          res.json({
            message: `Successfully marked attendance for ${update.matricno}`
          });
        } else {
        
          throw new Error("An Error Ocurred")
        }
       
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const abort=(time)=>{
  while(true){
    if (time.toUpperCase==="NO TIMER"){
      break
    }
    // console.log("will logout after",time)
    const abortTime=(time.split("/")[0]*1)*10000
    // console.log("will logout after",abortTime)
    setTimeout(async() => {
      const logout=await fetch("http://localhost:2500/api/attendance/logout",{
        method:"GET"
      })
      return false
    }, 1000);
  }
}

module.exports = router;



