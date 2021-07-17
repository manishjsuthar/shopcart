var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//defining schema
var userSchema = new Schema({
  username: {type: String, required: true},
  gender : {type: String, required: true},
  phone: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  cpassword: {type: String, required: true},
  tokens:[{
    token:{type: String, required: true}
  }]
})
  
//generating token
userSchema.methods.generateAuthToken = async function(){
  try{
    const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token:token});
    //console.log(token);
    await this.save();
    return token;
  }catch(error){
    res.send("error is:" + error);
    console.log("error is:" + error);
  }
}

// bcrypt: converting password to hash
userSchema.pre ("save", async function(next) {
  if(this.isModified("password")){
    //console.log(`current password is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = await bcrypt.hash(this.password, 10);
    //console.log(`current password is ${this.password}`);
  }
  next();
})


module.exports = mongoose.model('User', userSchema);
