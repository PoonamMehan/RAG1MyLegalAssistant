import {useForm} from 'react-hook-form'
import { useState, useEffect} from 'react'
import axios from 'axios'
import {useDispatch, useSelector} from "react-redux"
import {login as storeLogin} from "../store/authSlice"
import { Link } from 'react-router-dom' 
import { useNavigate } from 'react-router-dom'


function Register(){

    const {register, handleSubmit, formState, reset} = useForm()
    const [errMsg, setErrMsg] = useState("")
    const dispatch = useDispatch()
    const userLoginStatusSCT = useSelector((state)=> state.auth.status)
    const userLoginUserDataSCT = useSelector((state) => state.auth.userData)
    const navigate = useNavigate()
    

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
            const registerdUser = await axios.post("http://localhost:8000/api/v1/user/register", {
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
                console.log("User not registered properly", registerdUser)
            }
            // console.log("Returned user data after registration: ", registerdUser)

            
            if(registerdUser){
                const loggedInUser = await axios.post("http://localhost:8000/api/v1/user/login", {
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
                reset()
                navigate("/chat")
            }
            

        }catch(error){
            console.log("Error occured: ", error)
            if(error.status >= 400 && error.status <500){
                console.log("now: ", error.status, "and", error.response.data)
                if(error.response.data.includes("Username")){
                    
                    setErrMsg("User with this Username already exists!")
                }else if(error.response.data.includes("Email")){
                    setErrMsg("User with this Email already exists!")
                }
                else{
                    setErrMsg("All fields are required!")
                }
            }else if(error.status >= 500 && error.status < 600){
                setErrMsg("Something went wrong at the server. Try again!")
            }
        }

    }

    return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50"> {/* Center the form and set a light background */}


                <form

                    onSubmit={handleSubmit(signUp)}
                    className="max-w-md w-full mx-4 p-6 bg-white rounded-lg shadow-lg border border-gray-100"
                >
                    {/* Username Field */}
                    <div className="mb-6">
<h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Create a new account
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all">
                        Login
                    </Link>
                </p>
                
                {errMsg && <p className="text-center text-red-600 mb-6 text-lg">{errMsg}</p>}
                        
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username here!"
                            {...register("username", {
                                required: "Username is required",
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        {formState.errors.username && (
                            <span className="text-sm text-red-600 mt-1 block">
                                {formState.errors.username.message}
                            </span>
                        )}
                    </div>
        
                    {/* Email Field */}
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            placeholder="Enter your email here!"
                            {...register("email", {
                                required: "Email is required",
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                },
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        {formState.errors.email && (
                            <span className="text-sm text-red-600 mt-1 block">
                                {formState.errors.email.message}
                            </span>
                        )}
                    </div>
        
                    {/* Password Field */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password here!"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be longer than 6 characters",
                                },
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        {formState.errors.password && (
                            <span className="text-sm text-red-600 mt-1 block">
                                {formState.errors.password.message}
                            </span>
                        )}
                    </div>
        
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                    >
                        Submit
                    </button>
                </form>
            </div>
    );
}

export {Register}; 