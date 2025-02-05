import connectDB from "./db/index.js"
import dotenv from "dotenv"
import {app} from "./app.js"

dotenv.config({
    path: "./.env"
});

connectDB().then(() => {
    const portNum = process.env.PORT || 8000;
    console.log(portNum);
    const server = app.listen(portNum, ()=>{console.log("Server is listening on PORT: ", portNum)});
    server.on("error", ()=>console.log("Express app failed to listen."));
}
).catch((error)=>{console.log("Connection to Mongo DB not made successfully: ", error)})