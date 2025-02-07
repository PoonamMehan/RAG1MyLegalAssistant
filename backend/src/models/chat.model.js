import mongoose from "mongoose"
import {Schema} from "mongoose"
import {User} from "./user.model.js"
import { aggregatePaginate } from "mongoose-aggregate-paginate-v2"

const chatSchema = new Schema({
    user: {

        type: Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
    messages: [

        {
            role: {
                type: String,
                required: true,
                enum: ["system", "assistant", "user", "tool"]
            },
            message: {
                type: String,
                required: true
            }
        }

    ]

})

// chatSchema.plugin(aggregatePaginate)

export const Chat = mongoose.model("Chat", chatSchema)