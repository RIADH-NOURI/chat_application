import mongoose from "mongoose";

const { Schema } = mongoose; 

const messagesSchema = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
        auto: false,
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,  
        ref: 'User',
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',  
        required: true,
    },
    text: {
        type: String,  
    },
    deletedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],

    images: [{
        type:String,
    }],
    files: [{
        type: String,
    }],
    isRead: {
        type: Boolean,
        default: false
    },
    usersRead: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    reactions: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        emoji: {
            type: String,
            required: true
        }
    }]
}, 
{ timestamps: true }
);

const Message = mongoose.model('Message', messagesSchema);

export default Message;
