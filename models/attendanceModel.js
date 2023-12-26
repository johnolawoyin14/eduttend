// models/attendance.js

const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: { type: String,require:true },
  date: {
    type: Date,
    default: Date.now,
    get: function (date) {
      return date
        .toISOString()
        .replace(/T/, " ")
        .replace(/\.\d+Z$/, "");
    },
  },
  course: { type: String, require:true },
  matricno: { type: String, require:true },
  imagename: { type: String, require:true },
  status: { type: String, require:true },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
