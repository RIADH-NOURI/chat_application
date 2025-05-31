import express from "express";
import cors from "cors";
   

const expressConfig = (app)=>{
    app.use(cors({
        origin: "*",
        credentials: true
    }))
    
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
}

export default expressConfig;