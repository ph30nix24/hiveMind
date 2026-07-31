import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversation',
    },
    role: {
        type: String,
        enum: ["user", "assistent"]
    },
    content: String
})


const Message = mongoose.model('message', messageSchema);

export default Message