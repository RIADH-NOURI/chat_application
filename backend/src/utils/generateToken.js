import { config } from "dotenv";
import jwt from "jsonwebtoken";


config();




class GenerateTokenHelper {
    static generateToken(req, res, user) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({
            token: token,
            message: "Token generated successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                picture: user.picture,
            },
        });
    }
}

export default GenerateTokenHelper;