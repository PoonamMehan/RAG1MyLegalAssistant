import {Chat} from "../models/chat.model.js"
import { ApiError } from "../utils/ApiError.js"
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
                message: "You are a highly intelligent and professional Legal Assistant, designed to help the general public understand laws relevant to their queries. Your primary role is to provide clear, accurate, and relevant legal information based on the laws I (the programmer) provide to you or any of the Existing laws in India. You are directly talking to the user so, frame your answers accordingly. For every user query, you will receive exactly two laws that may be relevant. Your task is to analyze the user's query and determine if it directly pertains to the laws provided. Instructions: If the user's query is related to the provided laws: Use the given laws to formulate your response. Explain the relevant legal points concisely and clearly. Provide any additional necessary information. If the user's query is unrelated to the provided laws: Politely inform the user that no relevant laws were found in the database of laws. Do not engage too much in unrelated discussions or provide speculative legal advice. But, be freindly and if the user conversates about general matters you can talk to them and politely at the end remind them that you are here to assist them for their legal queries."
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

    const encoder = new TextEncoder()
    //extract user query from req.body
    const {userQuery, user} = req.body

    //generate embedding using this query
    const msgEmbedding = await createEmbeddingMistral(userQuery)
    

    //use this embedded value to query pinecone
    const pineconeQueriedResult = await queryPinecone(msgEmbedding.data[0].embedding);

    //format the result from pinecone
    let resultString = "POTENTIALLY RELEVANT LAWS: ";
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


    resultString += "USER QUERY: "
    //format result string to include all the results from pinecone and also include user query in it
    resultString += userQuery

    //use these messages to get the response generate from mistral
    const resultStream = await mistralChatCompletion([...allMessages, {role : "user",
        content: resultString}])

        res.setHeader("Transfer-Encoding", "chunked");
        res.setHeader("Content-Type", "text/plain");

    let finalGeneratedAnswer = ""

    for await (const chunk of resultStream) {
        let streamText = chunk.data.choices[0].delta.content;
        finalGeneratedAnswer += streamText
        streamText = encoder.encode(streamText)
        res.write(streamText)
    }


    //save user query in Mongo DB
    allMessagesDB.messages.push({role: "user", message: userQuery})
    

    // save the respone in the db
    allMessagesDB.messages.push({role: "assistant", message: finalGeneratedAnswer})
    
    await allMessagesDB.save({validateBeforeSave: false})


    const temp = await Chat.findOne({user: user._id})
    console.log("here", temp)

    // res.status(200).json(new ApiResponse(200, finalGeneratedAnswer, "Successfully answer was generated!")) 
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

const modifyAllEntries = async()=>{
    return await Chat.updateMany({}, {
        "$set": {"messages.0.message": "You are a highly intelligent and professional Legal Assistant, designed to help the general public understand laws relevant to their queries. Your primary role is to provide clear, accurate, and relevant legal information based on the laws I (the programmer) provide to you or any of the Existing laws in India. You are directly talking to the user so, frame your answers accordingly. For every user query, you will receive exactly two laws that may be relevant. Your task is to analyze the user's query and determine if it directly pertains to the laws provided. Instructions: If the user's query is related to the provided laws: Use the given laws to formulate your response. Explain the relevant legal points concisely and clearly. Provide any additional necessary information. If the user's query is unrelated to the provided laws: Politely inform the user that no relevant laws were found in the database of laws. Do not engage too much in unrelated discussions or provide speculative legal advice. But, be freindly and if the user conversates about general matters you can talk to them and politely at the end remind them that you are here to assist them for their legal queries."}
    })
}


export {initialDataSave, generateAnswer, getMsgHistory, modifyAllEntries}