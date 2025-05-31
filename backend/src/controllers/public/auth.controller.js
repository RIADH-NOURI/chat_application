import User from "../../models/user.module.js";
import bcrypt from "bcrypt";
import HashPasswordHelper from "../../utils/hashPasswod.js";
import GenerateTokenHelper from "../../utils/generateToken.js";

export const register = async(req, res)=>{
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }
      const hashedPassword = await HashPasswordHelper.hashPassword(password);
        const user = new User({username, email, password: hashedPassword});
        await user.save();
        res.status(201).json({message:"User created successfully", user: user});
    } catch (error) {
        res.status(500).json({message:"Something went wrong", error: error.message});
    }
}   

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {  // ✅ Check if user exists before accessing `password`
            return res.status(401).json({ message: "Invalid credentials email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials password" });
        }

        //res.status(200).json({ message: "Login successful", user: user });

        // Generate token and set cookie
       GenerateTokenHelper.generateToken(req, res, user);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",
            error: error.message
         });
    }
};
  