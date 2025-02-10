import {useState, useEffect} from 'react'
import axios from 'axios'
import {useForm} from 'react-hook-form'

function ChatInterface(){

    const [messages, setMessages] = useState([])
    const {register, handleSubmit, reset} = useForm()

    const getMessageHistory = async()=>{
        //wrap in try catch
        try{
            const result = await axios.post("/api/v1/chat/get-message-history", {}, {
            withCredentials: true  
        })
        return result.data;
        }
        catch(error){
            console.log("Error in catching the message history: ", error)
            return []
        }
    }



    const addMessage = (role, msg)=>{
        setMessages((oldVal)=>{[...oldVal, {role: role, message: msg}]})
    }


    const getAnswer = async(data)=>{
        //clear the input fiels upon submition
        //store query in messages 
        //store answer in messages
        //when messages will change the new query will be added automatically MAKE A SEPARATE FUNCTION FOR IT
        //when response will be fetched show it on the page dynamically

        try{
            reset()
            console.log("userquery in getAnswer : ", data.userQuery)
            addMessage("user", data.userQuery)
        
            const answer = await axios("/api/v1/chat/generate-answer", {"userQuery": data.userQuery},
                {
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            )

            console.log("Answer: ", answer)
        }
        catch(error){
            console.log("Error occured while generating the response", error)
        }
    }

    useEffect(()=>{
        (async()=>{
            const data = await getMessageHistory()
            setMessages(data.data.messages)
        })()
        
    }, [])

    useEffect(()=>{
        console.log("use effect messages", messages)
    }, [messages])

    return(
        <>
        <div>
            {/* div to show the message history*/}
            <div>
                {}
            </div>
            <div>
                <form onSubmit={handleSubmit(getAnswer)}>

                <input type="text" placeholder="Enter your query here!" {...register("userQuery", {
                required: true
                })}></input>
                <button type="submit">GetAnswer</button>
                </form>
                
            </div>
            
        </div>
        </>
    )
}

export {ChatInterface};