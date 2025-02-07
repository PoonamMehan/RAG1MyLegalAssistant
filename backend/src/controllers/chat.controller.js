import {Chat} from "../models/chat.model.js"
import { ApiError } from "../utils/apiError.js"
import asyncHandler from "../utils/asyncHandler.js"


//call it from registration function
const initialDataSave = async (userId)=>{
    try{
        const chatEnabled = await Chat.create({
            user: userId,
            messages: [{
                role: "system",
                message: "You are a Personal Legal Assistant, to help general public find answers to their queries regarding the existing laws they want to know about that will help them make decisions making sure they are not violating an existing law. You give anser to the user queries. For every question top 2 laws are returned that are relevant to the question. Use these laws to answer the user queries, also give them any additional information that requires to answer their question."
            }]
        })
        if(!chatEnabled){
            throw new ApiError(500, "Something went wrong while setting up chat for this user.")
        }

        chatEnabled.messages.push({
            role: "assistant",
            message: "Hi! I am your Personal Legal Assistant to save you from getting behind the bars."
        })

        const secondMessageAdded = await chatEnabled.save({validateBeforeSave: false})
        if(!secondMessageAdded){
            throw new ApiError(500, "Something went wrong while setting up chat for this user.")
        }
        
    }catch(error){
        console.log("Something went wrong while adding initial values for chat in the DB:", error)
        throw new ApiError(500, "Something went wrong while adding initial values for chat in the DB")
    }
}


const generateAnswer = asyncHandler((req, res)=>{
    const {userQuery} = req.body

})


export {initialDataSave}