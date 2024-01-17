const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const validator = require("validator");

const studentSchema = new Schema({
  matricno: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  courses: {
    type: Array,
    require: true,
  },
});

studentSchema.statics.addStaff = async function (matricno, password, name, courses) {
  if (!matricno || !password || !name || !courses) {
    throw Error("Incomplete Credientials");
  }


  if (!validator.isStrongPassword(password)) {
    throw Error("password not strong enough");
  }
  const exists = await this.findOne({ matricno });
  if (exists) {
    throw Error("matricno already exist");
  }
  const salt = await bcrypt.getSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const staff = await this.create({
    matricno,
    name,
    password: hash,
    courses,
  });

  return staff;
};
studentSchema.statics.login = async function (matricno, password) {
  if (!matricno || !password) {
    throw Error("Incomplete credientials");
  }
  const staff = await this.findOne({ matricno });

  if (!staff) {
    throw Error("Incorrect matricno");
  }
  const match = await bcrypt.compare(password, staff.password);

  if (!match) {
    throw Error("Incorrect Password");
  }

  return staff;
};
module.exports = mongoose.model("student", studentSchema);
