import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const registerUser = asyncHandler(
    async(req,res)=>{
    //step 1: Get data from Frontend
    //step 2: Check for validation
    //step 3: check if the user already exist or not [by using email or username]
    //step 4: check for the image file [avatar{required} and cover img]
    //step 5: upload them to cloudinary
    //step 6: create user object - create entry in db
    //step 7: remove password and refresh token
    //step 8: check for usercreation
    //step 9: return res

    //step 1
    const {fullName,username,email,password} = req.body
    console.log("email",email)

    //step 2
    // if(fullName === ""){
    //     throw new ApiError(400,"this field is required")
    // }
    if ([fullName,username,email,password].some((field)=>field?.trim() === "")) {
        throw new ApiError(400,"All field is required")
    }

    //step 3
    const existedUser = await User.findOne(
        {
            $or:[{username},{email}]
        }
    )
    if (existedUser) {
        throw new ApiError(409,"User with same email or username already exist")
    }

    //step 4
    const avatarLocalpath = req.files?.avatar[0]?.path;
    // const coverImageLocalpath = req.files?.coverImage[0]?.path;
    let coverImageLocalpath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalpath = req.files.coverImage[0].path;
    }

    if(!avatarLocalpath){
        throw new ApiError(400,"Avatar is required")
    }

    //step 5
    const avatar = await uploadOnCloudinary(avatarLocalpath);
    const coverImage = await uploadOnCloudinary(coverImageLocalpath);

    if(!avatar){
        throw new ApiError(400,"Avatar is required")   
    }

    //step 6
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    //step 7,8
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering a user")
    }

    //step 9
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
})

export {registerUser}                    