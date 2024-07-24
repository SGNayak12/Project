import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'
import {cloudinaryFileUpload} from '../utils/clodinary.js'
import jwt from 'jsonwebtoken';
import { json } from "express";
// import {uploadOnCloudinary} from "../utils/cloudinary.js"

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
    const createdUser=await User.findById(user._id).select("-password");
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

const updatePassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body;
    const user=await User.findById(req.user?.id);

    const isPasswordCorrect=user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect){
         throw new ApiError(401,"Invalid password");
    }
    user.password=newPassword;
    user.save({validateBeforeSave:false});

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Password updated successfully")
    )

})

const getCurrentUser=asyncHandler(async(req,res)=>{
    const user=req.user;
     return res
    .status(200)
    .json(new ApiResponse(
        200,
        {user},
        "User fetched successfully"
    ))

})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullname,email}=req.body;
    if(!(fullname||email)){
        throw new ApiError(401,"fields are empty");
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullname:fullname,
                email:email
            }
            
        },
        {
            new:true
        }
    ).select("-password")

    return res
    .status(200)
    .send(json(
        new ApiResponse(200,"Email ans Password updated successfully")
    ))

})

const updateavatarImage=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.files?.path;

    if(!avatarLocalPath){
        throw new ApiError(401,"Avatar file not found");
    }
    const avatar=await cloudinaryFileUpload(avatarLocalPath);
    if(!avatar.url){
        throw new ApiError(401,"Error while uploading the avatar");
    }

    const user=User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {
            new:true
        }
    ).select("-password");
 return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )


})

const updateCoverImage=asyncHandler(async(req,res)=>{
       const localCoverImagePath=req.files?.path;
       if(!localCoverImagePath){
        throw new ApiError(401,"Error in coverImage")
       }

       const coverImage=await cloudinaryFileUpload(localCoverImagePath);

       if(!coverImage.url){
        throw new ApiError(401,"Error while uploading");
       }

       const user=User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverimage:coverImage.url
            }
        },
        {
            new:true
        }
       ).select("-password");

       res.status(200).json(
        new ApiResponse(200,{ user},"coverImage updated Successfully")
       )
})

//TODO: delete old image
const deleteImage=asyncHandler(async(req,res)=>{
    const userId=req.user?._id;
    const user= await User.findByIdAndUpdate(
        userId,
        {
            $set:{
                avatar:" "
            }
        },
        {
            new:true
        }
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200,{user},"Avatar image deleted successfully")
    )
})

const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})
export {registeredUser,loginUser,logOutUser,refreshAccessToken,getCurrentUser,updatePassword,updateAccountDetails,updateavatarImage,deleteImage,getUserChannelProfile};