import {useDispatch, useSelector} from 'react-redux'
import {logout as storeLogout} from "../store/authSlice.js"
import axios from "axios"
import {useEffect} from 'react'


function Logout(){
    const dispatch = useDispatch()
    const userData = useSelector((state)=>{ state.auth.userData })

    useEffect(()=>{
        console.log("Logout", userData)
    },
[dispatch, userData])
    const logout = async()=>{
        try{
            const loggedOut = await axios.post("/api/v1/logout", {}, {
                withCredentials: true
            })

            if(loggedOut){
                dispatch(storeLogout)
            }
        }catch(error){
            console.log("User not loggedOut successfully: ", error)
        }
    }
    return(
        <><button onClick={logout}>Logout</button></>
    )
}

export {Logout}