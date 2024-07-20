import mongoose,{Schema, Types} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const userSchema =new Schema({
  userName: { type: String, required: true,lowercase:true,trim:true },
  //index:true,unique:true
  email: { type: String, required: true, unique: true,lowercase:true,trim:true},
  fullName: { type: String, required: true,trim:true,index:true},
  avatar: { type: String,//clodinary url
    required:true},
  coverimage:{
  type:String, //cloudinary url

  },
  watchHistory:[{type:Schema.Types.ObjectId,ref:"Vedio"}],
  password:{type:String,required:[true,'password is required']},
  refreshToken:{type:String},
},
{
  timestamps:true
}

)

userSchema.pre("save", async function(next){
  if(!this.isModified("password"))return next();
this.password=await bcrypt.hash(this.password,10)
next()
})

userSchema.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken= function(){
  return  jwt.sign({
    _id:this._id,
    email:this.email,
    username:this.username,
    fullname:this.fullname
  },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
    _id:this._id,
    email:this.email,
    username:this.username,
    fullname:this.fullname
  },process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}

const User=mongoose.model("User",userSchema);

export {User}