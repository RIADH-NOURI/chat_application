import { client } from "../../config/googleAuth.js";
import User from "../../models/user.module.js";
import GenerateTokenHelper from "../../utils/generateToken.js";



export const googleAuth = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
   const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      return res.status(200).json({ message: "User already exists" });
    }
    const { name, email, picture } = payload;

    const newUser = new User({
      Username: name,
      email,
      picture,
      password : ""
    });
    await newUser.save();
     GenerateTokenHelper.generateToken(req, res, newUser);


    res.status(200).json({ message: "User created successfully", email, name, picture });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}