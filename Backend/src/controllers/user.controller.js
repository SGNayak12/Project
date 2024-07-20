import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'
import { ThemeContext } from "@emotion/react";
import {cloudinaryFileUpload} from '../utils/clodinary.js'


const registeredUser=asyncHandler(async(req,res,next)=>{
    const {fullName,userName,email,password}=req.body;
     if (
        [fullName, email, userName, password].some(field => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    // console.log(req.files);

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    // let coverImageLocalPath;
    // if(req.files && Array.isArray(req.files.CoverImage) && req.files.CoverImage.length>0 ){
    //     coverImageLocalPath=req.files.CoverImage[0].path;
    // }
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }
    if(!coverImageLocalPath){
        throw new ApiError(400,"CoverImage is required");
    }
    
    const avatar=await cloudinaryFileUpload(avatarLocalPath);
    const coverImage=await cloudinaryFileUpload(coverImageLocalPath);
    // console.log(coverImage.response.url)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required");
    }
    
    const user=await User.create({
        fullName,
        email,
        avatar:avatar.response.url,
        // coverImage:coverImage?.response.url || "",
        coverImage:coverImage.response.url,
        password,
        userName:userName.toLowerCase()
    })
    
    const createdUser=await User.findById(user._id).select("-password")
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

    // res.send("Hi");

    



    
})
export {registeredUser};