import { useState, useEffect } from 'react'
import './App.css'

import {useDispatch, useSelector} from 'react-redux'
import {login as storeLogin} from "./store/authSlice.js"

import axios from 'axios'
import { Logout } from './components/Logout.jsx'

import { Link, Outlet } from 'react-router-dom'
import ChatPage from './pages/ChatPage.jsx'

import { useNavigate } from 'react-router-dom'
import { logout as storeLogout } from './store/authSlice.js'

function App() {

  const dispatch = useDispatch()
  const userAuthState = useSelector((state)=>state.auth.status)
  const navigate = useNavigate() 

  const KeepUserLogInUponRefresh = async()=>{
    try{

      let userData = await axios.post("http://localhost:8000/api/v1/user/refresh-access-only",{}, {
        withCredentials: true
      })

      userData = {
        email: userData.data.data.email,
        username: userData.data.data.username,
        _id: userData.data.data._id
    }

      dispatch(storeLogin(userData))
    }catch(error){
      //if the refresh token is expired
      if(error.status >= 400 && error.status < 500 ){
        dispatch(storeLogout())
        navigate("/login")
    } 
    //for 500 errors
      //error if the access token or refresh token is expired
      //it is getting a refreshedAccessToken, so only check for error where refresh token is expired or it is a 500 error
      console.log("Access token not refreshed to keep the user loggedIn upon refresh:", error)
    }
  }

  useEffect(()=>{
    KeepUserLogInUponRefresh()
    console.log("It ran")
  }
  ,[])

  return userAuthState? (
    <>
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden w-full">
      {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center relative w-full">
            {/* App Name - Absolutely Centered */}
            <h1 className="text-3xl font-bold text-gray-800 text-center absolute left-1/2 transform -translate-x-1/2">
                My Legal Assistant
            </h1>

            {/* Logout Button */}
            <Logout className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ml-auto"/>
        </div>
        {/* <ChatPage/> */}
        <Outlet/>
    </div>
    </>
  ):(
    <>
      <div className="flex flex-col h-screen bg-gray-50 w-full">
    {/* Header */}
    <header className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center w-full">
        {/* App Name - Absolutely Centered */}
        <h1 className="text-3xl font-bold text-gray-800 text-center absolute left-1/2 transform -translate-x-1/2">
            My Legal Assistant
        </h1>

        {/* Login and Register Buttons */}
        <div className="flex gap-4 ml-auto">
            <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
                Login
            </Link>
            <Link
                to="/register"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
            >
                Register
            </Link>
        </div>
    </header>

    {/* Login Component */}
    <div className="flex-1 overflow-y-auto">
        <Outlet/>
    </div>
</div>
    </>
  )
}

export default App
