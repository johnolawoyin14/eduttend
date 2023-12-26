// models/attendance.js

const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: { type: String, require: true },

  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },

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

  course: { type: String, require: true },
  matricno: { type: String, require: true },
  imagename: { type: String, require: true },
  status: { type: String, require: true },

  status: { type: Number, enum: [0, 1] }, // 0 for absent, 1 for present
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
