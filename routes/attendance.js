// routes/attendance.js

const express = require("express");
const router = express.Router();
const Attendance = require("../models/attendanceModel");
const Student=require("../models/studentModel")

// Endpoint to receive attendance data from Django server
router.post("/update", async (req, res) => {
  const { studentId, status } = req.body;

  try {
    // Find or create the student based on studentId
    let student = await Student.findOne({ studentId });
   

    // Check if attendance record already exists for today
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
});

module.exports = router;
``