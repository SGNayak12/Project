import mongoose, {isValidObjectId, modelNames} from "mongoose"
import {Like} from "../models/like.model.js"
import {Video} from '../models/video.model.js'
import {Comment} from '../models/comment.model.js'
import {Tweet} from '../models/tweet.model.js'
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleLike=async(model,resourceId,userId)=>{
    if(!(isValidObjectId(resourceId))|| !(isValidObjectId(userId))){
        throw new ApiError(404,"Invalid resourceId or userId")
    }

    const Model=model.modelName;

    const isLiked=await Like.findOne({
            [Model.toLowerCase()]:resourceId,
            likedBy:userId
    })

    let response;
    try {
        if(!isLiked){
            response=await Like.create({
                [Model.toLowerCase()]:resourceId,
                likedBy:userId
            })
        }
        else{
            response=await Like.deleteOne({
                [Model.toLowerCase()]:resourceId,
                likedBy:userId
            })
        }
    } catch (error) {
        throw new ApiError(
            505,
            error?.message||"Something went wrong in toggleLike"
        )
    }

    const totalLikes=await Like.countDocuments({
        [Model.toLowerCase]:resourceId
    })

    return {response,isLiked,totalLikes};
}

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    const {isLiked,totalLikes}=toggleLike(
        Video,
        videoId,
        req.user?._id

    )

    return res.status(200).json(
        new ApiResponse(200,{totalLikes},!isLiked? "Liked successfully" : "Like removed successfully")
    )
    
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    

    const {isLiked,totalLikes}=toggleLike(
        Comment,
        commentId,
        req.user?._id

    )

    return res.status(200).json(
        new ApiResponse(200,{totalLikes},!isLiked? "Comment Liked successfully" :"Like removed Successfully")
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    const {totalLike,isLiked}=toggleLike(
        Tweet,
        tweetId,
        req.user?._id

    )

    return res.status(200).json(
        new ApiResponse(
            200,{totalLike},!isLiked?"Liked successfully":"Like removed successfully"
        )
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId=req.user?._id;

    if(!isValidObjectId(userId)){
        throw new ApiError(404,"Invalid user Id")
    }


    const likedVedio=await Like.aggregate([
        //stage1
        {
            $match:{
                $and:[
                    {
                        likedBy:new mongoose.Types.ObjectId(userId)
                    },
                    {
                        video:{$exists:true}
                    }
                ]
            }
        },
        //stage2
        {
            $lookup:{
                from:"videos",
                localField:"vedio",
                foreignField:"_id",
                as:"video",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"user",
                            pipeline:[
                                {
                                    $project:{
                                        username:1,
                                        fullname:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },{
                        $addFields:{
                            owner:{
                                $first:"$user"
                            }
                        }
                    }
                ]
            }
        },
        {
          $addFields: {
              details: {
                  $first: "$video"
              }
          }
      }
        
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200,"likedVedio","Vedio details fetched successfully")
    )


})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}