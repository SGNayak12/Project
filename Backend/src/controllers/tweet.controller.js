import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {tweetContent}=req.body;

    if(tweetContent.trim()===""){
        throw new ApiError(404,"Invalid tweet")
    }

    try {
        const tweet=await Tweet.create({
            tweetContent,
            owner:req.user?._id
        })
    } catch (error) {
        return new ApiError(404,"Error while uploading the tweet")
    }


    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet uploaded succesfully."));

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userID}=req.params;

    if(!isValidObjectId(userID)){
        throw new ApiError(404,"invalid userID")
    }

    const allTweets=await Tweet.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userID)
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
                            fullName:1,
                            avatar:1

                        }
                    }
                ]
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"tweet",
                as:"numOfLike"
            }
        },
        {
            $addFields:{
                details:{
                    $first:"$userDetails"
                },
                likes: {
                    $size: "$numOfLike",

                }
            }
        }
    ])

    if(!allTweets.length){
        throw new ApiError(404,"No tweets found")
    }
    
    res.status(200).json(
        200,
        new ApiResponse(200,allTweets,"User tweets fetched successfully")
    )

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { content } = req.body;
    const { tweetID } = req.params;

    if (content?.trim() === "") {
        throw new ApiError(400, "Content is missing.");
    }

    const responce = await Tweet.findByIdAndUpdate(
        tweetID,
        {
            $set: {
                content,
            },
        },
        {
            new: true,
        }
    );

    if (!responce) {
        throw new ApiError(500, "Error while updating tweet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, responce, "Tweet updated succesfully."));
})


const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetID } = req.params;

    if (!isValidObjectId(tweetID)) {
        throw new ApiError(401, "Invalid tweetID.");
    }

    const responce = await Tweet.findByIdAndDelete(tweetID);

    if (!responce) {
        throw new ApiError(500, "Something went wrong while deleting Tweet.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, responce, "Tweet deleted succesfully."));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
