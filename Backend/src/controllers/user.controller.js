import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'
import {cloudinaryFileUpload} from '../utils/clodinary.js'
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshToken=async(userId)=>{
      try {
        const user=await User.findById(userId);
        const AccessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({ validateBeforeSave:false });
        
    return {AccessToken,refreshToken};

      } catch (error) {
        throw new ApiError(500,'Something went wrong')
      }
}
const registeredUser=asyncHandler(async(req,res,next)=>{
    // res.status(200).json({ message: "works fine!" });
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
    console.log(user._id);
    const createdUser=await User.findById(user._id).select("-password")
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

const loginUser=asyncHandler(async(req,res)=>{
    const {userName,email,password}=req.body;

    if(!(userName && email)){
        throw new ApiError(400,'Username or email is required');
    }

    const user=await User.findOne({
        $or:[{userName},{email}]
    })

    if(!user){
        throw new ApiError(400,'User not Found');
    }

    const validPassword=await user.isPasswordCorrect(password);
    if(!validPassword){
        throw new ApiError(401,'Invalid user credentials');
    }

    const {AccessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
    
    const loggedInUser = await User.findById(user._id);
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("AccessToken",AccessToken,options)
    .cookie("RefreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,AccessToken,refreshToken
            },
            "user login successfull"
        )
    )
})

const logOutUser=asyncHandler(async(req,res)=>{
    const Id=req.user.refreshToken;
    await User.findByIdAndUpdate(
        
        req.user._id,
        {
           $set:{
            refreshToken:undefined
           }
        },
        {
            new:true
        }
    )
    const Options={
        httpOnly:true,
        secure:true

    }
    return res
    .status(201)
    .clearCookie("accessToken",Options)
    .clearCookie("refreshToken",Options)
    .json(
        new ApiResponse(200,{ },"User logged Out")
    )

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    try {
        // console.log(req.cookies.refreshToken)
        const incomingrefreshToken=req.cookies?.RefreshToken || req.body.refreshToken;
        if(!incomingrefreshToken){
            throw new ApiError(400,"Unauthorized access");
        }
    
        const decodedToken=jwt.verify(incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET);
    
    
        const user=await User.findById(decodedToken?._id);
        if(!user){
            throw new ApiError(400,'Invalid Refresh Token');
        }
        console.log(user.refreshToken);
        console.log(incomingrefreshToken);

    
        if(incomingrefreshToken!==user?.refreshToken){
            throw new ApiError(400,'Refresh Token has been expired');
        }
    
         const options = {
                httpOnly: true,
                secure: true
            }
    
        const {AccessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);
        return res
            .status(200)
            .cookie("accessToken", AccessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {AccessToken, RefreshToken: newRefreshToken},
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})
export {registeredUser,loginUser,logOutUser,refreshAccessToken};