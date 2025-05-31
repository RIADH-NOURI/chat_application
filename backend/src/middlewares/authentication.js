import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const authentication = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        res.status(500).json({ message: "Invalid or expired token" });
    }
};

export default authentication;
