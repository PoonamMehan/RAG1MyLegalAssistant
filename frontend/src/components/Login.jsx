import { useForm } from "react-hook-form"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { login as storeLogin} from "../store/authSlice"
import axios from "axios"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

function Login (){
    const dispatch = useDispatch()
    const [loginType, setLoginType] = useState("email")
    const {register, handleSubmit, formState, reset} = useForm()
    const [errMsg, setErrMsg] = useState("")
    const navigate = useNavigate()

    const changeLoginWay = ()=>{
        if(loginType==="email"){
            setLoginType("username")
        }else{
            setLoginType("email")
        }
    }

    const login = async(data) => {
        setErrMsg("")
        try{
            console.log("data: ", data)
            
            const loggedInUser = await axios.post("http://localhost:8000/api/v1/user/login", {
                username: data.username,
                 email: data.email,
                password: data.password
            },
            {
                headers: {
                  'Content-Type': 'application/json'
                }
            })


            if(!loggedInUser){
                console.log("user not logged In properly", loggedInUser)
            }
            console.log("Returned user data after login: ", loggedInUser)

            
            if(loggedInUser){
                const userData = {
                    email: loggedInUser.data.data.user.email,
                    username: loggedInUser.data.data.user.username,
                    _id: loggedInUser.data.data.user._id
                }
                console.log("userData", userData)
                dispatch(storeLogin(userData))
                console.log("Logged the user in!")
                reset()
                navigate("/chat")
            }
            
        }catch(error){
            console.log("Error while logging the user in: ", error)
            if(error.status >= 400 && error.status < 500){
                setErrMsg("Email/Username or password is wrong!")
            }
        }
    }

    
    return(
            <div className="flex justify-center items-center min-h-screen bg-gray-50"> {/* Center the form and set a light background */}
                <div className="max-w-md w-full mx-4 p-6 bg-white rounded-lg shadow-lg border border-gray-100">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Log in to your account
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Don&apos;t have an account yet?{" "}
                    <Link to="/register" className="text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all">
                        Register
                    </Link>
                </p>

                {errMsg && <p className="text-center text-red-600 mb-6 text-lg">{errMsg}</p>}
                    {/* Toggle between Email and Username */}
                    <div className="text-center mb-6">
                        <span className="text-gray-700">
                            Login using{" "}
                            <button
                                onClick={changeLoginWay}
                                className="text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                            >
                                {loginType === "email" ? "Username" : "Email"}
                            </button>
                        </span>
                    </div>
        
                    {/* Login Form */}
                    <form onSubmit={handleSubmit(login)}>
                        {/* Email or Username Field */}
                        {loginType === "email" ? (
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="text"
                                    placeholder="Enter your email here"
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
                        ) : (
                            <div className="mb-6">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username here"
                                    {...register("username", {
                                        required: "Username is required!",
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                {formState.errors.username && (
                                    <span className="text-sm text-red-600 mt-1 block">
                                        {formState.errors.username.message}
                                    </span>
                                )}
                            </div>
                        )}
        
                        {/* Password Field */}
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password" // Changed to type="password" for security
                                placeholder="Enter your password here"
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
            </div>
    )
}

export{ Login }