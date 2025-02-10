import {useForm} from 'react-hook-form'
import { useState, useEffect} from 'react'
import axios from 'axios'
import {useDispatch, useSelector} from "react-redux"
import {login as storeLogin} from "../store/authSlice"

function Register(){

    const {register, handleSubmit, formState} = useForm()
    const [errMsg, setErrMsg] = useState("")
    const dispatch = useDispatch()
    const userLoginStatusSCT = useSelector((state)=> state.auth.status)
    const userLoginUserDataSCT = useSelector((state) => state.auth.userData)

    useEffect(()=>{
        setErrMsg("")
    }, [])

    useEffect(()=>{
        console.log("is user logged in? : ", userLoginStatusSCT)
        console.log("THis is the user's data in store: ", userLoginUserDataSCT)
    }, [userLoginStatusSCT, userLoginUserDataSCT, dispatch])

    const signUp = async (data) => {
        
        console.log("data: ", data)
        try{
            //send data to backend for registration
            //if regstration is successfull, login the user also (or we can prompt the user to login)
            const registerdUser = await axios.post("/api/v1/user/register", {
                username: data.username,
                email: data.email,
                password: data.password
            },
            {
                headers: {
                  'Content-Type': 'application/json'
                }
            })


            if(!registerdUser){
                console.log("user not registered properly", registerdUser)
            }
            // console.log("Returned user data after registration: ", registerdUser)

            
            if(registerdUser){
                const loggedInUser = await axios.post("api/v1/user/login", {
                    username: data.username,
                    password: data.password
                },
                {
                    withCredentials: true
                }
            )
                if(!loggedInUser){
                    console.log("User not loggedIn properly after registration.")
                }

                const userData = {
                    email: loggedInUser.data.data.user.email,
                    username: loggedInUser.data.data.user.username,
                    _id: loggedInUser.data.data.user._id
                }

                dispatch(storeLogin(userData))

            }
            

        }catch(error){
            console.log(error)
            setErrMsg(error.message)
        }

    }

    return(
        <form onSubmit={handleSubmit(signUp)}>
            <label htmlFor='username'>Username</label>
            <input id="username" type="text" placeholder="Enter your username here!" {...register("username",{
                required: "Username is required",
            })}/>
            {formState.errors.username && <span className="text-red-600">{formState.errors.username.message}</span>}


            <label htmlFor="email">Email</label>
            <input id="email" type="text" placeholder="Enter your email here!" {...register("email",{
                required: "Email is required",
                validate: {
                    matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                "Email address must be a valid address"
                }
            })}/>
            {formState.errors.email && <span className="text-red-600">{formState.errors.email.message}</span>}


            <label id="password">Password</label>
            <input id="password" type="text" placeholder="Enter your password here!" {...register("password",{
                required: "Password is required",
                minLength: {
                    value: 6,
                    message: "Password must be longer than 6 characters"
                },
            })}/>
            {formState.errors.password && <span className="text-red-600">{formState.errors.password.message}</span>}


            <button>Submit</button>

        </form>
    )
}

export {Register}; 