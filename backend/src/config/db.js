
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose"
export const ConnectDb = async()=>{
   try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
   } catch (error) {
    console.log("Error connecting", error);
   }
}