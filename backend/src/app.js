import express from "express";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
import chatRouter from "./routes/chat.route.js"


import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
});

const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/user", userRouter)
app.use("/api/v1/chat", chatRouter)

export {app}