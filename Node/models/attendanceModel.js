// models/attendance.js

const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: { type: String, require: true },


  date: {
    type: String,
    require:true
  },
  time: {
    type: String,
    require:true
  },

  course: { type: String, require: true },
  matricno: { type: String, require: true },
  imagename: { type: String, require: true },
  status: { type: String, require: true },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
