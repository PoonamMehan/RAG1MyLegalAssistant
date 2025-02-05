import mongoose from "mongoose";
import {Schema} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: [true, "Email is required"],
    },
    password: {
        type: String,
        required: true,
        trim: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    }
},
{
    timestamps: true,
}
)

userSchema.pre("save", async function(next)){
    if(this.isModified )
}


const User = mongoose.model("User", userSchema);