// models/attendance.js

const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
<<<<<<< HEAD
  student: { type: String,require:true },
=======
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
>>>>>>> 8bd1a0838e4c7e3266e1d954f789339f9cf2e6f5
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
<<<<<<< HEAD
  course: { type: String, require:true },
  matricno: { type: String, require:true },
  imagename: { type: String, require:true },
  status: { type: String, require:true },
=======
  status: { type: Number, enum: [0, 1] }, // 0 for absent, 1 for present
>>>>>>> 8bd1a0838e4c7e3266e1d954f789339f9cf2e6f5
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
