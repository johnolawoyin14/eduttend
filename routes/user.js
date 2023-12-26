const router=require("express").Router()
const path =require("path")
const multer=require("multer")
const {
  login,
  addStaff,
  addStudent,
  student,
  students,
  staffs,
  staff,
  removeStaff,
  removeStudent,
  editStaff,
  editStudent
} = require("../controllers/userConroller");

  const studentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./students/");
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null,`${ req.body.name}` + ".jpg");
    },
  });
  const staffStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      
      cb(null, "./staffs/");
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null,`${ req.body.name}` + ".jpg");
    },
  });
  
const uploadStaff= multer({ storage: staffStorage });
const uploadStudent = multer({ storage: studentStorage });


router.post("/login",login)
router.post("/addStaff",uploadStaff.single("image"),addStaff)
router.post("/addStudent", uploadStudent.single("image"), addStudent);
router.get(`/download/:filename`, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../students", filename);
  console.log(filePath);

  res.sendFile(filePath);
});
router.get(`/downloadStaff/:filename`, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../staffs", filename);
  console.log(filePath);

  res.sendFile(filePath);
});
router.get("/students",students)
router.get("/student/:id",student)
router.get("/staffs",staffs)
router.get("/staff",staff)
router.delete("/staff/:id",removeStaff)
router.patch("/edit/:id",editStaff)
router.patch("/addStudent/:id",editStudent)
router.delete("/student/:id",removeStudent)


module.exports=router