const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const bcrypt=require("bcryptjs")
const validator=require("validator")

const staffSchema=new Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    imagename:{
        type:String,
        require:true
    },
    courses:{
        type:Array,
        require:true
    }
})

staffSchema.statics.addStaff=async function ({email,password,name,courses,imagename}){
  if (!email || !password || !name || !courses || !imagename) {
    throw Error("Incomplete Credientials");
  }
  if (!validator.isEmail(email)) {
    throw Error("Please input a valid email ");
  }
 
  const exists= await this.findOne({email})
  if(exists){
    throw Error("Email already exist")
  }
  const salt=await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password,salt)
  const staff= await this.create({
    email,name,password:hash,courses,imagename
  })

  return staff
}
staffSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Incomplete credientials");
  }
  const staff = await this.findOne({ email });

  if (!staff) {
    throw Error("Incorrect Email");
  }
  const match = await bcrypt.compare(password, staff.password);

  if (!match) {
    throw Error("Incorrect Password");
  }

  return staff;
};
module.exports=mongoose.model("staff",staffSchema)