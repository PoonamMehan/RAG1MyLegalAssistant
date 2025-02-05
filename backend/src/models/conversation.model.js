import mongoose from "mongoose"
import {Schema} from "mongoose"
import {User} from "./user.model.js"
import { aggregatePaginate } from "mongoose-aggregate-paginate-v2"

const conversationSchema = new Schema({
    user: {

        type: Schema.Types.ObjectId,
        ref: "User"

    },
    messages: [

        {
            role: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }

    ]

})

conversationSchema.plugin(aggregatePaginate)

export const Conversation = mongoose.model("Conversation", conversationSchema)