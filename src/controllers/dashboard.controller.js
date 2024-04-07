import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async(req,res)=>{
    //Todo: get the channel stats like total video, vies, total subscription, total videos , total likes etc.

})

const getChannelVideos = asyncHandler(async(req,res)=>{
    //Todo: Get all the videos uploaded by the channel

})

export {
    getChannelStats,
    getChannelVideos
}