const jwt = require("jsonwebtoken");
const Staff = require("../models/staffModel");
const Student = require("../models/studentModel");
const multer = require("multer");
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    if (req.body.email === "admin" && req.body.password === "PASSWORD") {
      req.session.isAuthenticated = true;
      res.status(200).json("/admin");
    } else {
      const staff = await Staff.login(email, password);
      const token = await createToken(staff._id);
      const data = {
        name: staff.name,
        email: staff.email,
        courses: staff.courses,
        token,
      };
      console.log(data);
      req.session.isAuthenticated = true;
      res.status(200).json(`/staff/${staff._id}/course`);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
const addStaff = async (req, res) => {
  const { email, password, name, courses } = req.body;
  const course = JSON.parse(courses);
  if (!req.file) {
    res.status(400).json({ error: "The image field is empty" });
  } else {
    const filename = req.file.filename;
    console.log(req.body, filename);

    try {
      const staff = await Staff.addStaff({
        email,
        password,
        name,
        courses: course,
        imagename: filename,
      });

      res.status(200).json(`${staff.name} was successfully added`);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
};
const addStudent = async (req, res) => {
  console.log(req.body);
  const { matricno, name, courses } = req.body;
  if (!req.file) {
    res.status(400).json({ error: "Pls input an image" });
  } else {
    const filename = req.file.filename;
    if (!matricno || !name || !courses || !filename) {
      res.status(400).json({ error: "Incomplete field" });
    }
    const c = [courses];

    const postData = {
      matricno,
      name,
      courses: c,
      imagename: filename,
    };
    const exists = await Student.findOne({ matricno });

    if (exists) {
      console.log("this student exist:", exists);
      exists.courses.push(courses);

      const update = await Student.findOneAndUpdate(
        { _id: exists._id },
        { $set: { courses: exists.courses } }
      );
      res
        .status(200)
        .json(`${exists.name} was successfully updated with ${courses}`);
    } else {
      try {
        const student = await Student.create(postData);
        res
          .status(200)
          .json(
            `${student.name} has been successfully registered with matric no ${student.matricno}`
          );
      } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
      }
    }
  }
};

const students = async (req, res) => {
  console.log(req.body);
  try {
    const students = await Students.find({}).sort({ createdAt: -1 });
    console.log(students);
    res.status(200).json(students);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.messsage });
  }
};
const student = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const student = await Student.findOne({ _id: id });
    res.status(200).json(student);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
const removeStudent = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const student = await Student.findOneAndDelete({ _id: id });
    // res.status(200).json(student)
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
const staffs = async (req, res) => {
  console.log(req.body);
  try {
    const staffs = await Staff.find({}).sort({ createdAt: -1 });
    console.log(staffs);
    res.status(200).json(staffs);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.messsage });
  }
};
const staff = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const staff = await Staff.findOne({ _id: id });
    res.status(200).json(staff);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
const editStudent = async (req, res) => {
  const { id } = req.params;
  const { courses } = req.body;
  if (req.body) {
    try {
      const exists = await Student.findOne({ _id: id });
      exists.courses.pop(courses);
      if (exists) {
        const student = await Student.findOneAndUpdate(
          { _id: id },
          { $set: { courses: exists.courses } }
        );
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: "please fill in the required fields" });
  }
};
const editStaff = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const { email, courses } = req.body;
    const staff = await Staff.findOneAndUpdate(
      { _id: id },
      { $set: { courses, email } }
    );
    res.status(200).json("Update successful");
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
const removeStaff = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const staff = await Staff.findOneAndDelete({ _id: id });
    res.status(200).json(staff);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
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
  editStudent,
};
