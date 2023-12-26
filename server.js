require("dotenv").config()

const express=require("express")
const app=express()
const ejs=require("ejs")
const http=require("http").createServer(app)
const mongoose=require("mongoose")
const morgan=require("morgan")
const path=require("path")
const socket=require("socket.io")(http)
const port=process.env.PORT
const Staff=require("./models/staffModel")
const Student=require("./models/studentModel")
const Attendance=require("./models/attendanceModel")
const userRoute=require("./routes/user")
const attendanceRoute=require("./routes/attendance")
const session=require("express-session")
app.use(morgan("dev"))
app.use(express.json())

app.set("view engine","ejs")
app.use(express.static("assets"))
app.use(express.urlencoded({ extended: true }));


// Configure session for /admin route
app.use(
  session({
    secret: "yourGlobalSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, path: "/" },
  })
);
app.use(
  "/admin",
  session({
    name: "adminSession",
    secret: "adminSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, path: "/admin" },
  })
);

// Configure session for /staff route
app.use(
  "/staff",
  session({
    name: "staffSession",
    secret: "staffSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, path: "/staff" },
  })
);
const isAuthenticated = async (req, res, next) => {
  console.log(req.session)
  // Check if the request path is "/login" or if the user is authenticated
  if (req.path === "/login" || req.session.isAuthenticated) {
    return next();
  } else {
    // Redirect to the login page for unauthenticated users
    res.redirect("/login");
  }
};
app.use("/admin", isAuthenticated);
app.use("/staff", isAuthenticated);

app.use("/api/auth", userRoute);
app.use("/api/attendance", attendanceRoute);
app.get("/login",async (req, res) => {
  
  res.render("pages/login", {
    title: "Staff Login",
  });
});
app.get("/test",async (req, res) => {
  
  res.render("pages/test", {
    title: "Staff Login",
  });
});




app.get('/admin',async(req,res)=>{
    try {
     const staffs = await Staff.find({}).sort({ createdAt: -1 });
     console.log(staffs);
     res.render("pages/admin",{
         title:"ADMIN",
         staffs:staffs
     })
  
   } catch (error) {
     console.log(error);
     res.status(400).json({ error: error.messsage });
   }
})
app.get("/logout", (req, res) => {
  const isAdmin = req.path.startsWith("/admin");

  if (isAdmin) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying admin session:", err);
      }
      res.redirect("/login");
    });
  } else {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying staff session:", err);
      }
      res.redirect("/login");
    });
  }
});

app.get('/admin/update/:id',async(req,res)=>{
    const {id}=req.params
         try{
            const staff = await Staff.findOne({_id:id});
            res.render("pages/editStaff",{
                title:`Edit ${staff.name}`,
                staff:staff
            })
         }
         catch(error){
            console.log(error)
         }

})
app.get('/admin/regStaff',(req,res)=>{
    res.render("pages/addStaff",{
        title:"Staff Registration"
    })
})

app.get("/studentReg",async(req,res)=>{
    res.render("pages/addStudent",{
        title:"Student Registration"
    })
})
app.get("/staff/:id/course/:name/courseReg", async (req, res) => {
        const { id, name } = req.params;

        try{

                 const staffs = await Staff.findById({ _id: id });
                 if(!staffs){
                  res.status(400).json({error:"Server error"})
                 }
                 else{
                        req.session.isAuthenticated = true;

                   res.render("pages/addStudentwithcourses", {
                     title: "Course Registration",
                     course:name
                   });

                 }


        }
        catch(error){
          res.status(400).json({error:"Server error"})
        }
});

app.get("/sucessful",async(req,res)=>{
    res.render("pages/thankyou",{
        title:"Successful"
    })
})
app.get("/staff/:id/course", async (req, res) => {
  const { id } = req.params;
  try {
    const staffs = await Staff.findById({ _id: id });
    const staffCourses = staffs.courses.map(
      (course) => new RegExp(course, "i")
    );

    console.log("Staff Courses:", staffCourses);

    const students = await Student.find({ courses: { $in: staffCourses } });
    const studentCourses = students
      .map((student) => student.courses.map((course) => course))
      .flat();

    const commonCourses = staffCourses.filter((course) =>
      studentCourses.includes(course)
    );
    console.log("common courses:", commonCourses);

    console.log("Students:", students);
    res.render("pages/staff", {
      title: `Staff`,
      staff: staffs,
      students: students,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json("Server error");
  }
});
app.get("/staff/:id/course/:name", async (req, res) => {
  const { id, name } = req.params;
  console.log(name);
  try {
    const staffs = await Staff.findById({ _id: id });
    const staffCourses = staffs.courses.map(
      (course) => new RegExp(course, "i")
    );

    console.log("Staff Courses:", staffCourses);
    const students = await Student.find({
      courses: {
        $elemMatch: { $regex: new RegExp(name, "i") },
      },
    });

    console.log("Students:", students);
          req.session.isAuthenticated = true;

    res.render("pages/course", {
      title: `Staff`,
      staff: staffs,
      students: students,
      course: name,
      req: req,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json("Server error");
  }
});
app.get("/staff/:id/course/:name/attendance", async (req, res) => {
  const { id, name } = req.params;
  console.log(name);
  try {
    const staffs = await Staff.findById({ _id: id });
    const students = await Attendance.find({ course: { $in: name } });

    console.log("Students:", students);
          req.session.isAuthenticated = true;

    res.render("pages/courseAttendance", {
      title: `Staff`,
      staff: staffs,
      students: students,
      course: name,
      req:req
    });
  } catch (error) {
    console.log(error);
    res.status(400).json("Server error");
  }
});
app.get("/staff/:id/attendance", async (req, res) => {
  const { id } = req.params;
  try {
    const staffs = await Staff.findById({ _id: id });
    const staffCourses = staffs.courses.map(
      (course) => new RegExp(course, "i")
    );

    console.log("Staff Courses:", staffCourses);

    const attendance = await Attendance.find({ course: { $in: staffCourses } });
   

    console.log("Students:", attendance);
          req.session.isAuthenticated = true;

    res.render("pages/attendance", {
      title: `Attendance`,
      staff: staffs,
      students: attendance,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json("Server error");
  }
});


mongoose.connect(process.env.DB)
.then((result)=>{
    http.listen(port,()=>{console.log(`listening on ${port}`)})
})
.catch((error)=>{
    console.log(error)
})
