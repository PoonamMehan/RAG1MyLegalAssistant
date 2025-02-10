import { useState, useEffect } from 'react'
import './App.css'
import { Register } from './components/Register'
import {useDispatch} from 'react-redux'
import {login as storeLogin} from "./store/authSlice.js"
import axios from 'axios'
import { Login } from './components/login.jsx'
import { Logout } from './components/Logout.jsx'
import { ChatInterface } from './components/ChatInterface.jsx'

function App() {

  const dispatch = useDispatch()
  const KeepUserLogInUponRefresh = async()=>{
    try{

      let userData = await axios.post("/api/v1/user/refresh-access-only",{}, {
        withCredentials: true
      })

      userData = {
        email: userData.data.data.email,
        username: userData.data.data.username,
        _id: userData.data.data._id
    }

      dispatch(storeLogin(userData))
    }catch(error){
      console.log("Access token not refreshed to keep the user loggedIn upon refresh:", error)
    }
  }

  useEffect(()=>{
    KeepUserLogInUponRefresh()
    console.log("It ran")
  }
  ,[])

  return (
    <>
    <div> 
    {/* <Logout/>
    <Login/> */}
    <ChatInterface/>
    </div>
    </>
  )
}

export default App
