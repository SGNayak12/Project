import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from 'jsonwebtoken';
import {User } from '../models/user.model.js';
const verifyjwt=asyncHandler(async(req,res,next)=>{
    try {
        const Token=req.cookies?.accessToken||req.headers("Authorization")?.replace("Bearer ","");
        if(!Token){
            throw new ApiError(401,"Unauthorized request");
        }
        const decodedToken=jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET);
        const user=User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user){
            throw new ApiError(401,"Invalid access Token")
        }
        req.user=user;
        next();
    } catch (error) {
       throw new ApiError(401,error?.message||'Invalid access token');   
    }
})
export {verifyjwt}