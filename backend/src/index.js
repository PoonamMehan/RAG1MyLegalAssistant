import connectDB from "./db/index.js"
import {app} from "./app.js"
import { pineconeSetup } from "./utils/pineconeSetup.js";
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
});

connectDB().then(() => {
    // Script to create pinecone index and converting text dataset into vector embeddings
    // try{
    //     pineconeSetup();
    // }
    // catch(error){
    //     console.log("Error occured while setting up pinecone: ", error)
    // }
    
    const portNum = process.env.PORT || 8000;
    console.log(portNum);
    const server = app.listen(portNum, ()=>{console.log("Server is listening on PORT: ", portNum)});
    server.on("error", ()=>console.log("Express app failed to listen."));
}
).catch((error)=>{console.log("Connection to Mongo DB not made successfully: ", error)})