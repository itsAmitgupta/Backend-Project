import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
         await user.save({validateBeforeSave:false})

         return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating the Refresh and Access Token")
    }
    
}

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

const loginUser = asyncHandler(
    async(req,res) =>{
        //step 1 data from req.body
        //step 2  validate data
        //step 3 check for user exist using email or username
        //step 4 check the password
        //step 5 generate access token and refresh token
        //step 6 send cookies

        const {username,email,password} = req.body
        console.log(email)

        // if(!username || !email){
            if(!username && !email){
            throw new ApiError(400,"username or email is required")
        }

        const user = await User.findOne({
            $or:[{username},{email}]
        })

        if(!user){
            throw new ApiError(404,"user does not exist")
        }

      const isPasswordValid = await user.isPasswordCorrect(password)

      if(!isPasswordValid){
        throw new ApiError(401,"invalid user credentials")
      }
      const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
      
      const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
      
      const options={
        httpOnly:true,
        secure:true
      }

      return res.status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
        new ApiResponse(200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "user login successfully"
            )
      )
    }
)

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.body._id,
        {
            $set:{refreshToken:undefined}
        },
        {
            new:true
        }
        )

        const options ={
            httpOnly:true,
            secure:true
        }
        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"user logout"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }

    try {

        const decodedToken =jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

      const user = await User.findById(decodedToken?._id)

      if (!user) {
        throw new ApiError(401,"Invalid refresh token")
      }      

      if(incomingRefreshToken !== refreshToken){
        throw new ApiError(401,"Refresh token is expired or used")
      }

      const {newrefreshToken ,accessToken} = await generateAccessAndRefreshToken(user._id)

      const options ={
        httpOnly:true,
        secure:true
      }

      return res
      .send(200)
      .cookie("refreshToken",newrefreshToken,options)
      .cookie("accessToken",accessToken,options)
      .json(
        new ApiResponse(200,{accessToken,refreshToken:newrefreshToken},"Access token refreshed")
      )
    } catch (error) {
           throw new ApiError(401,error?.message || "Invalid refresh token")
    }

})

export {registerUser,loginUser, logoutUser,refreshAccessToken}                    