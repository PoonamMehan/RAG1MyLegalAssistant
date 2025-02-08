import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js"

export const verifyJWT = asyncHandler(async (req, _, next)=>{
    // req from client -> take access token
    // if access token not present error
    //if present, JWT.verify(acess token, access token secret)
    //id verifid extract user._id from it
    //serach this user up in our DB
    //if present in DB send next(user[-password, -refresh token])
    //if not then send error of expired access token

    try{
        //extract token from user's request
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new ApiError(401, "Unauthorized request.")
        }


        //get the access token verified by jwt
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        //find the user in db using the help of id came from decoded token and ensure that this user actually exists and is present in the backend
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user){
            throw new ApiError(401, "Invalid Access Token!")
        }
        
        req.body.user = user ;
        next()
    }catch(error){
        throw new ApiError(401, error?.message || "Invalid Access token")
    }
})