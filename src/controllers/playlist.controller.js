import mongoose from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createPlaylist = asyncHandler(async(req,res)=>{
    const {name,description}= req.body
    //todo :create playlist

})

const getUserPlaylist = asyncHandler(async(req,res)=>{
    const {userID}= req.params
    // Todo : get user playlist
})

const getPlaylistById = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params
    //Todo : get playlist by Id
})

const addVideoToPlaylist = asyncHandler(async(req,res)=>{
        const {playlistId,videoId} = req.params
        //Todo :
})

const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId,videoId} = req.params
    //Todo :remove video from playlist

})

const deletePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params
    //Todo : delete playlist
})

const updatePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params
    const {name,description} = req.body
    //Todo : update playlist

})

export {
    createPlaylist,
    getUserPlaylist,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}