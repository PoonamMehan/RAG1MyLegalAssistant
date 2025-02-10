import {Chat} from "../models/chat.model.js"
import { ApiError } from "../utils/apiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import {createEmbeddingMistral} from "../utils/mistral.js"
import { queryPinecone } from "../utils/pineconeSetup.js"
import { mongoose } from "mongoose"
import { mistralChatCompletion } from "../utils/mistral.js"
import { ApiResponse } from "../utils/ApiResponse.js"

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


const generateAnswer = asyncHandler(async (req, res)=>{
    //extract user query from req.body
    //generate embedding using this query
    //use this query to query pinecone
    //format the result from pinecone
    //fetch all the messages from Chat model and add the user query and result from pinecone into the messages
    //use these messages to get the response generated from mistral
    // save the respone in the db
    //return the res

    //extract user query from req.body
    const {userQuery, user} = req.body

    //generate embedding using this query
    const msgEmbedding = await createEmbeddingMistral(userQuery)
    

    //use this embedded value to query pinecone
    const pineconeQueriedResult = await queryPinecone(msgEmbedding.data[0].embedding);

    //format the result from pinecone
    let resultString = "Returned Results: ";
    pineconeQueriedResult.matches.map(val => (
        resultString += `date_of_creation: ${val.metadata.date_of_creation},
            law: ${val.metadata.law}
        `
    ))
   
    //fetch all the messages from Chat model and add the user query and result from pinecone into the messages
    const allMessagesDB = await Chat.findOne({user: user._id})


    let allMessages = allMessagesDB.messages
    allMessages = allMessages.map(m => {
        return{role: m.role, content: m.message}
    })



    //format result string to include all the results from pinecone and also include user query in it
    resultString += userQuery

    //use these messages to get the response generate from mistral
    const resultStream = await mistralChatCompletion([...allMessages, {role : "user",
        content: resultString}])

        res.setHeader("Transfer-Encoding", "chunked");
        res.setHeader("Content-Type", "text/plain");

    let finalGeneratedAnswer = ""
    
    for await (const chunk of resultStream) {
        const streamText = chunk.data.choices[0].delta.content;
        finalGeneratedAnswer += streamText
        res.write(streamText)
    }


    //save user query in Mongo DB
    allMessagesDB.messages.push({role: "user", message: userQuery})
    

    // save the respone in the db
    allMessagesDB.messages.push({role: "assistant", message: finalGeneratedAnswer})
    
    await allMessagesDB.save({validateBeforeSave: false})


    const temp = await Chat.findOne({user: user._id})
    console.log("here", temp)

    res.status(200).json(new ApiResponse(200, finalGeneratedAnswer, "Successfully answer was generated!")) 
    return res.end()
})

const getMsgHistory = asyncHandler(async(req, res)=>{
    const user = req.body.user
    const msgHistory = await Chat.findOne({user: user._id})
    
    if(!msgHistory){
        throw new ApiError(500, `Something went wrong while fetching the messages from the DB: ${msgHistory}`)
    }

    return res.status(200).json( new ApiResponse(200, {messages: msgHistory.messages}, "Messages fetched successfully"))
})


export {initialDataSave, generateAnswer, getMsgHistory}