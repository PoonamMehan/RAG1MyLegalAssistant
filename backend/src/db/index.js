import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async() => {
    try{
        const dbConnectionInstance = await mongoose.connect(`${process.env.MONGO_DB_CONNECTION_STRING}/${DB_NAME}`);
    }
    catch(error){
        console.log("Connection to DB failed: ", error);
        process.exit(1);
    }
}

export default connectDB