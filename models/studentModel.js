const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const studentSchema = new Schema({
  matricno: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
 
  imagename: {
    type: String,
    require: true,
  },
  courses: {
    type: Array,
    require: true,
  },
});

module.exports = mongoose.model("student", studentSchema);
