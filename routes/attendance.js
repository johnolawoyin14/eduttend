// routes/attendance.js

const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Attendance = require("../models/attendanceModel");
const staff = require("../models/staffModel");
const Student = require("../models/studentModel");

const secretKey = process.env.SECRET; // Replace with a secure secret key
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if(!req.session.token || !req.session.userId){

    return res.status(401).json({ error: "No user Logged in" });
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }

  
    next();
  });
}

router.post("/login", async (req, res) => {
  const { name } = req.body;

  try {
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
    console.log(token)
    req.session.token = token;
    req.session.userId = existingUser._id;

   const responseUser = {
      ...existingUser.toObject(),  // This spreads existingUser properties
      token}

    res.status(200).json({ user: responseUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error({ error: error.message });
  }
});

router.post("/logout",authenticateToken, (req, res) => {
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

router.post("/start/:id", authenticateToken,async (req, res) => {
  const { id } = req.params;
  const { timeout, course } = req.body;

  try {
    const exist = await staff.findById({ _id: id });
    if (exist) {
      const students = await Student.find({ courses: course });
      for (const stud of students) {
        const attend = await Attendance.create({
          student: stud.name,
          matricno: stud.matricno,
          imagename: stud.imagename,

          status: "absent",
          course,
        });
      }

      res
        .status(200)
        .json({ message: "Attendance records created successfully" });
    } else {
      throw Error("You are not Authorized");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log({ error: error.message });
  }
});
router.post("/update", authenticateToken, async (req, res) => {



// Endpoint to receive attendance data from Django server


  const { studentId, status } = req.body;

  try {
    // Find or create the student based on studentId
    let student = await Student.findOne({ studentId });
    const existingAttendance = await Attendance.findOne({
      student: student._id,
      date: new Date().toISOString().split("T")[0],
    });

    if (existingAttendance) {
      // Attendance record for today already exists
      res.json({
        message: "Attendance record already exists",
        attendance: existingAttendance,
      });
    } else {
      // Create new attendance record
      const newAttendance = new Attendance({
        student: student._id,
        status,
      });
      await newAttendance.save();
      res.json({
        message: "New attendance record created successfully",
        attendance: newAttendance,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})
module.exports=router