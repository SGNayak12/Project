import mongoose, { Schema, Types } from "mongoose";
import { User } from "./user.model";

const subscriptionSchema=new mongoose.Schema({
    subscriber:{
        Types:Schema.Types.ObjectId,
        // one who is subscribing
        ref:"User"
    },
    channel:{
        Types:Schema.Types.ObjectId,
        //one to whom a subcriber is subscribing
        ref:"User"
    }

},
{
    timestamps:true
})

const subscription=mongoose.model('subscription',subscriptionSchema)
export {subscription};