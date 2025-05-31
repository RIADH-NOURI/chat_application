import Room from "../../models/room.module.js";
import User from "../../models/user.module.js";
import { checkPersonalUser } from "../../utils/checkpersonaluser.js";
import { uploadToCloudinary } from "../../utils/uploadServices.js";

export const getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10,search="" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const loginId = req.user._id;
    const users = await User.find({ _id: { $ne: loginId },username: { $regex: search, $options: "i" }, })
      .select("-password -createdAt -updatedAt -__v -friends -rooms")
      .skip(skip)
      .limit(limit);
    const totalUsers = await User.countDocuments({ _id: { $ne: loginId },username: { $regex: search, $options: "i" }, });
    const totalPages = Math.ceil(totalUsers / limit);
    const hasMore = totalPages > page;
    res.json({
      pagination: { totalPages, currentPage: page, limit },
      hasMore,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const loginId = req.user._id; // Get the logged-in user's ID
    const user = await User.findById(loginId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await User.find({
      _id: {
        $ne: loginId,
        $nin: user.friends,
      },
      username: { $regex: search, $options: "i" },
    })
      .select("-password -createdAt -updatedAt -__v -friends -rooms")
      .skip((page - 1) * limit)
      .limit(limit);
    const totalUsers = await User.countDocuments({
      _id: { $ne: loginId, $nin: user.friends },
      username: { $regex: search, $options: "i" },
    });
    const totalPages = Math.ceil(totalUsers / parseInt(limit));
    const hasMore = totalPages > parseInt(page);
    res.json({
      pagination: {
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
      hasMore,
      users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existUser = await User.findById(id);
    if (!existUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // if(!checkPersonalUser(req,id)){
    //     return res.status(401).json({message:"Unauthorized"});
    // }
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log("user picture updated successfully",updateUser);
    
    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};
export const updateUserPicture = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const file = req.file.buffer;
    if (!file) {
      return res.status(400).json({ message: "Please upload a picture" });
    }
    const picture = await uploadToCloudinary(file);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { picture },
      { new: true }
    );
    res.json({ message: "User picture updated successfully", updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user picture", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password -friends");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get user", error: error.message });
  }
};

export const addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;

    if (userId === friendId) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend." });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    // Check if already friends
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Add friend (unidirectional)
    user.friends.push(friendId);
    friend.friends.push(userId);
    await user.save();
    await friend.save();
console.log("friend added successfully",friend);

    res.status(200).json({ message: "Friend added successfully", friend });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add friend", error: error.message });
      console.log("backend error",error.message);
      
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const friends = await User.find({
      _id: { $in: user.friends },
      username: { $regex: search, $options: "i" },
    }).select("-password -friends -rooms -email -createdAt -updatedAt -__v")
      .skip(skip)
      .limit(limit);
    const totalFriends = await User.countDocuments({
      _id: { $in: user.friends },
      username: { $regex: search, $options: "i" },
    });
    const totalPages = Math.ceil(totalFriends / limit);
    const hasMore = totalPages > page;
    res.json({
      pagination: {
        totalPages,
        currentPage: page,
        limit,
      },
      hasMore,
      friends,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get friends", error: error.message });
  }
};

export const joinUserInRooms = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (room.users.includes(userId)) {
      return res.status(400).json({ message: "You are already in this room" });
    }
    room.users.push(userId);
    await room.save();
    res.json({ message: "Joined room successfully", room });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to join room", error: error.message });
  }
};

