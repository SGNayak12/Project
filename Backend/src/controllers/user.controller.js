import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'

import {user} from '../models/user.model.js'
const registeredUser=asyncHandler(async(req,res)=>{
   

    // const {fullname,username,email,password}=req.body;
    // if(
    //     [fullname,username,email,password].some((field)=>
    //         field?.trim()==="")
    //     )
    // {
    //    throw new ApiError(404,"All Fields are required")
    // }
    // //Checking for the valid email address:
    // const emailStr = String(email);
    // if (emailStr.indexOf('@') === -1) {
    //     throw new ApiError(400, '@ required for email');
    // }
    // const existingUser=await user.findOne({
    //     $or:[{username},{email}]
    // })
    // if(existingUser){
    //     throw new ApiError(409,"User with this username and password already exists");
    // }

    // const avatarLocalPath=req.files?.avatar[0]?.path;

    // if(!avatarLocalPath){
    //     throw new ApiError(400,"Avatar file is required");
    // }

    // const User=await user.create({
    //     fullname,
    //     avatar:avatar.url,
    //     coverimage:coverimage?.url||"",
    //     email,
    //     password,
    //     username:username.toLowerCase()
    // })

    // const createdUser=await user.findById(User._id).select("-password -refreshToken")

    // if(!createdUser){
    //     throw new ApiError(500,"Something went wrong while registering the user")
    // }

    // return res.status(201).json(
    //     new ApiResponse(200,createdUser,"user registered successfully")
    // )

    
})
export {registeredUser};