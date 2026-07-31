import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        unique: true,
        required: true
    },
    title: {
        type: String,
        default: "New Chat",
        trim: true
    }
},{ timestamps: true })


const Conversation = mongoose.model("conversation", conversationSchema);


export default Conversation