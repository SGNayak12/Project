import mongoose, {isValidObjectId} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Avatar } from "@mui/material"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    
    try {
        const getAllVideos=Video.aggregate([
            {
                $match:{
                    owner:new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"userDetails",
                    pipeline:[
                        {
                            $project:{
                                username:1,
                                fullName:1,
                                Avatar:1
                            }
                        }
                    ]          
                }
            },
            {
                $addFields:{
                    userDetails:{
                        $first:"$userDetails"
                    }
                }
            }
        ])
    } catch (error) {
        
            throw new ApiError(500,"something went wrong while fetching the details")
    
    }

    const result=await Video.aggregatePaginate(getAllVideos,{page,limit});
    if(result.docs.length==0){
        return res.status(200).json(new ApiResponse(200,[],"No vedio founds"))
    }
    else
    {
        return res.status(200).json(new ApiResponse(200,result.docs,"vedios fetched successfully"))
    }
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    

    // console.log(req.files?.videoFile[0]?.path)
    // console.log(req.files?.thumbnail[0]?.path)

    const vedioLocalPath=req.files?.videoFile[0].path;
    const thumbnailLocalPath=req.files?.thumbnail[0].path;
    
    if([title,description,thumbnailLocalPath,vedioLocalPath].some((item)=>{item.trim()===' '})){
        throw new ApiError(404,"All fields are required")
    }
    
    const thumbnail=await uploadOnCloudinary(thumbnailLocalPath);
    const vedio=await uploadOnCloudinary(vedioLocalPath);

   console.log(vedio);

    if(!thumbnail){
        throw new ApiError(404,"Thumbnail link is required");
    }
    if(!vedio){
        throw new ApiError(404,"Vedio link is required ")
    }

    const video=await Video.create({
          videoFile:vedio.url,
          thumbnail:thumbnail.url,
          title,
          description,
          duration:vedio.duration,
          isPublished:true,
          owner:req.user?._id
    })

    await video.save();
    console.log("Video uploaded successfully")
    if(!video){
        throw new ApiError(404,"Error while uploading vedio")
    }
    return res.status(200).json(
        new ApiResponse(200,video,"Video uploaded successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid vedio id")
    }

    const vedio=await Video.findById(videoId);
    if(!vedio){
        throw new ApiError(404,"Error in fetching the vedio");
    }

    return res.status(200).json(
        new ApiResponse(200,vedio,"Vedio Fetched successfully")
    )

    

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title,description}=req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid VideoID.");
    }

    const thumbnailLocalPath=req.files?.path

    if(!title && !description && !thumbnail){
        throw new ApiError(400, "At lease one field is required.");
    }

    let thumbnail;
    if (thumbnailLocalPath) {
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnail.url) {
            throw new ApiError(
                400,
                "Error while updating thumbnail in cloudinary."
            );
        }
    }

    const response=Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title,
                description,
                thumbnail
            }
        },
        {
            new:true
        }
    )
    if (!response) {
        throw new ApiError(401, "Video details not found.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, response, "Video details updated succesfully.")
        );
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if(!isValidObjectId(videoId)){
        throw new ApiError(404,"Invalid object vedio")
    }

    // const response=await Video.deleteOne({
    //     _id:ObjectId(`${videoId}`)
    // })
    const deleteResponse=await Video.deleteOne({
        _id:ObjectId(videoId)
    })

    if(!deleteResponse.acknowledged){
        throw new ApiError(404,"Error while deleting the vedio")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, deleteResponce, "Video deleted succesfully.")
        );
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
     
    if(!isValidObjectId(videoId)){
        throw new ApiError(404,"invalid Vedio Id")
    }

    const response=await Video.findById(videoId);
    if(!response){
        throw new ApiError(404,"Vedio doesn't exist")
    }
    
    response.isPublished=!response.isPublished;
    await response.save({ValidationBeforeSave:false})
    return res
        .status(200)
        .json(new ApiResponse(200, response, "Published toggled succesfully."));


})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
