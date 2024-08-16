import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    let allComments;
    try {
        allComments=Comment.aggregate([
            {
                $match:{
                    video:new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"ownerDetails",
                    pipeline:[
                        {
                            $project:{
                                fullName:1,
                                avatar:1,
                                userName:1
                            }
                        }
                    ]
    
                }
            },
            {
                $addFields:{
                    userDetails:{
                        $first:"$ownerDetails"
                    }
                }
            },
            {
                $skip: (page - 1) * limit,
            },
            {
                $limit: parseInt(limit),
            }
        ])
    } catch (error) {
        throw new ApiError(404,"something went wrong while fetching the comments")
    }
    const response=await Comment.aggregatePaginate(allComments,{limit,page});

    if(response.docs.length===0){
        return res.status(200).json(
            new ApiResponse(200,"No comments for this vedio")
        )
    }

    res.status(200).json(
        new ApiResponse(200,response,"Comment fetched successfully")
    )
    


})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {vedioId}=req.params;
    const {content}=req.body;

    if(!isValidObjectId(vedioId)){
        throw new ApiError(404,"Invalid vedio Id")
    }

    const comment=await Comment.create({
        content,
        video:vedioId,
        owner:req.user?._id
    })

    await comment.save();

    if(!comment){
        throw new ApiError(404,"Error in uploading the comment")
    }

    return res.
    status(200)
    .json(
        new ApiResponse(200,comment,"Comment added successfully")
    )


})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const commentId=req.params;
    const {content}=req.body;

    if(content?.trim()===''){
        throw new ApiError(404,"Empty comment cannot be uploaded")
    }
    if(!(isValidObjectId(commentId))){
        throw new ApiError(404,"Invalid comment Id")
    }

    const response=await Comment.findByIdAndUpdate(
        commentId,
        {
            content
        },
        {
            new:true
        }
    )

    if(!response){
        throw new ApiError(504,"Error in updating the comment")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "Succesfully Updated comment."
        )
    )


})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentID}=req.params;

    if(!(isValidObjectId(commentID))){
        throw new ApiError(404,"Invalid comment Id")
    }

    const response=await Comment.findByIdAndDelete(commentID);

    if(!response){
        throw new ApiError(404,"Error in deleting the comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "Succesfully deleted comment."
        )
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
