import asyncHandler from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { initialDataSave } from "./chat.controller.js"
import {Chat} from "../models/chat.model.js" 
import {mongoose } from "mongoose"


const registerUser = asyncHandler(async(req, res)=>{
    //take information from the user
    //check if all the required fields are in there and add any validation needed
    //check if user already exists
    //create a user object
    //create an entry in the db
    //return user info
    
    //input usercredentials
    const {username, email, password} = req.body;
    console.log(username, email,password)
    //check if all required credentials are present and add validation check
    if([username, email, password].some((field)=>!field || field.trim()=="")){
        throw new ApiError(400, "All fields are required!")
    }

    //check in DB if user already exists
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        if(existedUser.username === username.trim().toLowerCase()){
            throw new ApiError(409, "User with this Username already exists!")
        }
        if(existedUser.email === email.trim().toLowerCase()){
            throw new ApiError(409, "User with this Email already exists!")
        }
    }

    //create a new entry in User model
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password
    })


    //if user not created successfully throw a new error
    const createdUser = await User.findById(user._id).select("-refreshToken -password")
    if(!createdUser){
        console.log("Something went wrong while creating the user: ",user);
        console.log("Fetched user: ", createdUser)
        throw new ApiError(500, "Something went wrong while registering the User.")
    }

    //now that user is created, we create a new entry in the Chat model
    await initialDataSave(user._id);

    const chatInitialEntry = await Chat.findOne({ user: new mongoose.Types.ObjectId(user._id) });
    if(!chatInitialEntry){
        console.log("Initial entry in the Chat model not made properly.", chatInitialEntry)
        throw new ApiError(500, "Something went wrong while making initial entry for the user in Chat model.")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!")
    )
})

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token.")
    }
}

const refreshAccessTokenOnly = asyncHandler(async(req, res)=>{
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findOne({_id: decodedToken._id})

        if(!user){
            throw new ApiError(401, "Invalid refresh token.")
        }

        if(incomingRefreshToken != user.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used.")
        }
        
        const options = {
            httpOnly: true,
            secure: true
        }

        const accessToken = await user.generateAccessToken()

        return res.status(200).cookie("accessToken", accessToken, options).json(
            new ApiResponse(200, {email: user.email, username: user.username, _id: user._id}, "NewAccessTokenGenerated")     
        )
} )

const loginUser = asyncHandler(async(req, res)=>{
    //take info from user
    //username/email password required
    //search username/email
    //if present, match password 
    //access and refresh token
    //send cookies

    //take login credentials from user
    const {email, username, password} = req.body;
    console.log("Request came: ", username, email, password)
    //check if required fields are available
    if(!(username?.trim() || email?.trim())){
        throw new ApiError(400, "Username or email, atleast one is required!")
    }


    //find user using username/email in DB
    const user = await User.findOne({
        $or: [{username: username?.trim().toLowerCase()}, {email: email?.trim().toLowerCase()}]
    })

    if(!user){
        throw new ApiError(401, "User does not exist.")
    }
    //verify password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Wrong Password")
    }

    //generate access and refresh tokens
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

 
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {user: loggedInUser}, "User Logged in Successfully!")
    )
})

const logoutUser = asyncHandler(async(req, res)=>{
    // extract user object from req
    // remove the value of refresh token from db
    // remove cookies from the response

    const user = req.user
    const updatedUser = await User.findByIdAndUpdate(user?._id, 
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    
    // if(!updatedUser){
    //     throw new ApiError(500, "Something went wrong while logging out user: ", updatedUser)
    // }
    
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken").json(new ApiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async(req, res)=>{
    //extract refresh token from req
    //from jwt decode the refresh token, get the user._id
    //if refresh token matches the one stored in our db, generate an access token
    //if access token generated successfully send the response

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try{
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
          
        const user = await User.findOne({_id: decodedToken._id})

        if(!user){
            throw new ApiError(401, "Invalid refresh token.")
        }



        if(incomingRefreshToken != user.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used.")
        }
        
        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {_id: user._id, email: user.email, username: user.username}, "Access token refreshed successfully!"
            )
        )
    }catch(error){
        throw new ApiError(500, `Something went wrong while refreshing the access token: ${error}`)
    }

})

export { registerUser, loginUser, logoutUser, refreshAccessToken, refreshAccessTokenOnly }