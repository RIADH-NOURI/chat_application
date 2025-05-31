import mongoose from "mongoose";

const { Schema } = mongoose; 

const userSchema = new Schema({
    username: {
        type: String,  
        //required: true,
    },
    email: {
        type: String,  
        required: true,
        unique: true,
    },
    password: {
        type: String,  
        required: true,
    },
    picture: {
        type: String,
        default:"",
    },
    friends:[{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    rooms:[{
        type: Schema.Types.ObjectId,
        ref: "Room",
    }],
}, 
{ timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
