import mongoose,{Schema, Types} from 'mongoose'

const userSchema =new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }

})

const user=mongoose.model("User",userSchema);

export {user}