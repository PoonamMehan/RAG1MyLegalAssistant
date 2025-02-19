import {useState, useEffect} from 'react'
import axios from 'axios'
import {useForm} from 'react-hook-form'
import parse from "html-react-parser"
import { useDispatch } from 'react-redux'
import { logout as storeLogout } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function ChatInterface(){

    const [messages, setMessages] = useState([])
    const {register, handleSubmit, reset} = useForm()
    const [answerStream, setAnswerStream] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loadingBeforeAnswerComes, setLoadingBeforeAnswerComes] = useState(false)



    //to keep the latest answer in view
    const messagesEndRef = useRef(null); 
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior:'auto' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages, answerStream, loadingBeforeAnswerComes]);

    const getMessageHistory = async()=>{
        //wrap in try catch
        try{
            const result = await axios.post("/api/v1/chat/get-message-history", {}, {
            withCredentials: true  
        })
            return result.data;
        }
        catch(error){

            //access token expiry
            // //if expired then get a new one
            if(error.status >= 400 && error.status < 500){
                try{
                    await axios.post("/api/v1/user/refresh-access-only", {}, {
                    withCredentials: true
                })
                }catch(err){
                     //refreshtokenexpiry
                        //dispatch(storeLogout())
                        //navigaate the user to "/login"
                    if(err.status >= 400 && err.status < 500 ){
                        dispatch(storeLogout())
                        navigate("/login")
                    }   
                }   
            }

            //500 error
            console.log("Error in catching the message history: ", error)
            return []
        }
    }



    const addMessage = (role, msg)=>{
        setMessages((oldVal)=>{return [...oldVal, {role: role, message: msg}]})
    }
    const deleteUserQueryFromMsg = ()=>{
        const msgsLen = messages.length
        setMessages(messages.filter((msg, idx)=>{if(idx != msgsLen){
            return msg}}))
    }

    const dynamicallySetMessages = (msg)=>{
            setAnswerStream(msg)
        }
    

        const parseResponse = (text) => {
            // Replace **bold** with <strong>bold</strong>
            text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        
            // Replace *italic* with <em>italic</em>
            text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
        
            // Replace \n with <br /> for new lines
            text = text.replace(/\n/g, "<br />");
        
            // Replace # Heading with <h1>Heading</h1>
            text = text.replace(/^# (.*$)/gm, "<h1>$1</h1>");
        
            return text;
        };

    const getAnswer = async(data)=>{
        //clear the input fiels upon submition
        //store query in messages 
        //store answer in messages
        //when messages will change the new query will be added automatically MAKE A SEPARATE FUNCTION FOR IT
        //when response will be fetched show it on the page dynamically
        try{
            reset()
            addMessage("user", data.userQuery)
            setLoadingBeforeAnswerComes(true)


            const answer = await fetch("/api/v1/chat/generate-answer", {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"userQuery": data.userQuery})
            }).then(async(res)=>{
                // reset()
                //before moving onto printing the response, we are first going to  check for the access token and refresh token's expiration or any other error
                //access token expiry
                // //if expired then get a new one
                if(res.status >= 400 && res.status < 500){
                    try{
                        console.log("error status", res.status)
                        console.log("error ", res)
                        const newAccessTokenRes = await axios.post("/api/v1/user/refresh-access", {}, {
                        withCredentials: true
                    })
                    console.log("response:",newAccessTokenRes)
                    }catch(err){
                        //refreshtokenexpiry
                            //dispatch(storeLogout())
                            //navigaate the user to "/login"
                        if(err.status >= 400 && err.status < 500 ){
                            console.log("err: ",err.status)
                            dispatch(storeLogout())
                            navigate("/login")
                        }   
                    }
                    deleteUserQueryFromMsg()
                    getAnswer(data);
                }else if(res.status >= 500){
                    console.log("Error occured while generating the response", res)
                    addMessage("assistant", "Some error occured while generating the response. Try again.")
                }else{
                //now handling the response after ensuring the response is right

            setLoadingBeforeAnswerComes(false)  
            // console.log("userquery in getAnswer : ", data.userQuery)
            
                    
                // console.log("res status", res.status)
                const reader = res.body.getReader()
                const decoder = new TextDecoder()
                let result = ""

                return reader.read().then(async function processText({done, value}){
                    
                    //create a place to add messages dynamically
                    // dynamicallySetMessages("")
                    if(done){
                        addMessage("assistant", result)
                        dynamicallySetMessages("")
                        return result
                    }

                    const text = decoder.decode(value || new Uint8Array(), {stream: true})

                    result = result+text
                    
                    dynamicallySetMessages(result)
                    return reader.read().then(processText)
                })
        }})

            
        }
        catch(error){
            console.log("Error occured while generating the response, likely a network error: ", error)
        }
    }

    useEffect(()=>{
        (async()=>{
            const data = await getMessageHistory()
            setMessages(data.data.messages)
        })()
    }, [])

    // useEffect(()=>{
    //     console.log("use effect messages", messages)
    // }, [messages])

    

    return(
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden w-full">
    {/* Chat Message History */}
    <div className="flex-1 overflow-y-auto p-6 w-full">
        <div className="max-w-3xl mx-auto w-full">
            <div className="flex flex-col space-y-4">
                {messages.map((msg, idx) => {
                    if (msg.role === "assistant") {
                        return (
                            <div
                                key={idx}
                                className="max-w-[80%] ml-auto bg-blue-100 p-4 rounded-lg shadow-sm"
                            >
                                {parse(parseResponse(msg.message))}
                            </div>
                        );
                    } else if (msg.role === "user") {
                        return (
                            <div
                            key={idx}
                                className="max-w-[80%] mr-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                            >
                                {msg.message}
                            </div>
                        );
                    }
                })}
                
                {loadingBeforeAnswerComes &&
                    <div className="ml-auto w-16">
                        <DotLottieReact
                            src="https://lottie.host/ce6fcd0d-03dc-41c1-b5c5-85ada0dd0caf/DgKs0xVGgh.lottie"
                            loop
                            autoplay
                        />
                    </div>
                }
            
                {answerStream && (
                    <div className="max-w-[80%] ml-auto bg-blue-100 p-4 rounded-lg shadow-sm">
                        {parse(parseResponse(answerStream))}
                    </div>
                )}
                {}
              <div ref={messagesEndRef}></div>
  
            </div>
        </div>
    </div>
    
    {/* Input Form (Sticks to the Bottom) */}
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 w-full">
        <div className="max-w-2xl mx-auto w-full">
            <form onSubmit={handleSubmit(getAnswer)} className="flex gap-2">

                <input
                    type="text"
                    placeholder="Enter your query here!"
                    {...register("userQuery", { required: true })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                >
                    Get Answer
                </button>
            </form>
        </div>
    </div>
</div>
    )
}

export {ChatInterface};