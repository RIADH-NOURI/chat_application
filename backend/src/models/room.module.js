import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true },  
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],  
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "RoomMessage" }],
    createdAt: { type: Date, default: Date.now },
},
{ timestamps: true }
);

const Room = mongoose.model("Room", RoomSchema);

export default Room;
