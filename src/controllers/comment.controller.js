import { Mongoose } from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  //Todo:add a comment to a video
});

const updateComment = asyncHandler(async (req, res) => {
  //Todo:update a comment
});

const deleteComment = asyncHandler(async (req, res) => {
  //Todo:Delete a comment
});

export { getVideoComments, addComment, updateComment, deleteComment };