import {useDispatch} from 'react-redux'
import {logout as storeLogout} from "../store/authSlice.js"
import axios from "axios"
import {useNavigate} from "react-router-dom"


// eslint-disable-next-line react/prop-types
function Logout({className}){
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logout = async()=>{
        try{
            const loggedOut = await axios.post("/api/v1/user/logout", {}, {
                withCredentials: true
            })

            if(loggedOut){
                dispatch(storeLogout())
            }
        }catch(error){
            //access token expiry
            // //if expired then get a new one
            if(error.status >= 400 && error.status < 500){
                try{
                    await axios.post("/api/v1/user/refresh-access", {}, {
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
                logout() 
            }

            //handle 500 server errors too
            console.log("User not loggedOut successfully: ", error)
        }
    }
    return(
        <>
        <button onClick={logout} className={`${className}`}>Logout</button>
        </>
    )
}

export {Logout}