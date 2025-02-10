import { useForm } from "react-hook-form"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { login as storeLogin} from "../store/authSlice"
import axios from "axios"

function Login (){
    const dispatch = useDispatch()
    const [loginType, setLoginType] = useState("email")
    const {register, handleSubmit, formState} = useForm()

    const changeLoginWay = ()=>{
        if(loginType==="email"){
            setLoginType("username")
        }else{
            setLoginType("email")
        }
    }

    const login = async(data) => {
        try{
            console.log("data: ", data)
            
            const loggedInUser = await axios.post("/api/v1/user/login", {
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
                console.log("user not registered properly", loggedInUser)
            }
            // console.log("Returned user data after registration: ", registerdUser)

            
            if(loggedInUser){
                const userData = {
                    email: loggedInUser.data.data.user.email,
                    username: loggedInUser.data.data.user.username,
                    _id: loggedInUser.data.data.user._id
                }

                dispatch(storeLogin(userData))
                console.log("Logged the user in!")
            }
            
        }catch(error){
            console.log("Error while logging the user in: ", error)
        }
    }

    
    return(
        <>

        <span>Login using <button onClick={changeLoginWay}>{loginType==="email"?("Username"):("Email")}</button></span>

        <form onSubmit={handleSubmit(login)}>
            {loginType==="email"? (<>

        <label htmlFor="email">Email</label>
        <input id="email" type="text" placeholder="Enter your email here: " {...register("email",{
                required: "Email is required",
                validate: {
                    matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                "Email address must be a valid address"
                }
            })}/>
            {formState.errors.email && <span className="text-red-600">{formState.errors.email.message}</span>}
        </>):(<>

        <label htmlFor="username">Username</label>
        <input id="username" type="text" placeholder="Enter your username here: " {...register("username",
            {
                required: "Username is required!"
            }
        )}/>
            {formState.errors.username && <span className="text-red-600">{formState.errors.username.message}</span>}

        </>)}
            
            <label htmlFor="password"></label>
            <input id="password" type="text" placeholder="Enter your password here: " {...register("password", {
                required:"Password is required",
                minLength: {
                    value: 6,
                    message: "Password must be longer than 6 characters"
                }
            })}/>
            {formState.errors.password && <span className="text-red-600">{formState.errors.password.message}</span>}

        
        <button type="submit">Submit</button>
        </form>
        
        </>
    )
}

export{ Login }