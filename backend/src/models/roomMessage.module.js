import mongoose from "mongoose";

const RoomMessageSchema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        auto:false
    },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    text: { type: String, required: true },
    images:[{ type: String, required: true }],
    files:[{ type: String, required: true }],
    createdAt: { type: Date, default: Date.now },
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isRead: { type: Boolean, default: false },
    usersRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reactions: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
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

const RoomMessage = mongoose.model("RoomMessage", RoomMessageSchema);
export default RoomMessage;
