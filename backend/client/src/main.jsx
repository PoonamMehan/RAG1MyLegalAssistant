import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux"
import store from "./store/store.js"
import Login from "./pages/Login.jsx"
import ChatPage from './pages/ChatPage.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './pages/Register.jsx'


const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App/>,
      children: [
        {
          path: "/",
          element: <Login/>
        },
        {
          path: "/login",
          element: <Login/>, 
        },
        {
          path: "/chat",
          element: <ChatPage/>
        },
        {
          path: "/register",
          element: <Register/>
        }
      ]
    }
  ]
)

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <Provider store={store}>
     <RouterProvider router={router}/>
    </Provider> 
  </StrictMode>,
)
