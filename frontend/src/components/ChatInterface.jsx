import {useState, useEffect} from 'react'
import axios from 'axios'
import {useForm} from 'react-hook-form'

function ChatInterface(){

    const [messages, setMessages] = useState([])
    const {register, handleSubmit, reset} = useForm()
    const [answerStream, setAnswerStream] = useState("")


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
        setMessages((oldVal)=>{return [...oldVal, {role: role, message: msg}]})
    }


    // const dynamicallySetMessages = (initialEntry, msg)=>{
    //     if(initialEntry){
    //         setMessages((oldVal) => {return [...oldVal, {role: "assistant", message: msg}]})
    //     }else{
    //         setMessages((oldVal) => {
    //             const newVal = [...oldVal]
    //             newVal[newVal.length-1] = {role: "assistant", message: msg}
    //             return newVal
    //         })
    //     }
    // }
    const dynamicallySetMessages = (msg)=>{
            setAnswerStream(msg)
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
        
            // const answer = await axios("/api/v1/chat/generate-answer", {"userQuery": data.userQuery},
            //     {
            //         headers: {
            //         'Content-Type': 'application/json'
            //         },
            //         withCredentials: true
            //     }
            // )

            const answer = await fetch("/api/v1/chat/generate-answer", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"userQuery": data.userQuery})
            }).then(async(res)=>{
                const reader = res.body.getReader()
                const decoder = new TextDecoder()
                let result = ""

                return reader.read().then(async function processText({done, value}){
                    
                    //create a place to add messages dynamically
                    // dynamicallySetMessages("")
                    if(done){
                        addMessage("assistant", result)
                        // dynamicallySetMessages("")
                        console.log("done", result)
                        return result
                    }

                    const text = decoder.decode(value || new Uint8Array(), {stream: true})
                    result = result+" "+text
                    
                    dynamicallySetMessages(result)
                    return reader.read().then(processText)
                })
            }).then((finalResult)=>{
                console.log("Answer: ", finalResult)
            })

            
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
                {messages.map((msg, idx)=>{
                    console.log("Ran")
                    if(msg.role==="assistant"){
                        return <div key={idx} className="mb-2 bg-red-300">{msg.message}</div>
                    }else if(msg.role==="user"){
                        return <div key={idx} className="mb-2 bg-orange-400">{msg.message}</div>
                    }
                })}
                {answerStream && <div className="mb-2 bg-red-300">{answerStream}</div>}
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