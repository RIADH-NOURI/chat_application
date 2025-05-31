import cloudinary from "../config/cloudinary.js";
import redisHelper from "./redis.helper.js";
import Message from "../models/messages.module.js";
import streamifier from "streamifier";
import { redisSchemaHelper , redisKeyHelper} from "./redisSchemaHelper.js";
export const uploadToCloudinary = async (fileBuffer,resource_type = "auto",format) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resource_type ,
        access_mode: 'public',
         format
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const uploadManyImages = async (req, res) => {
  try {
    const { messageId } = req.params;
    console.log("messageId:", messageId);

    // Check message existence early
    const messageExists = await Message.exists({ _id: messageId });
    if (!messageExists) throw new Error("Message not found");

    // Upload images in parallel
    const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer,"image"));
    const urls = await Promise.all(uploadPromises);

    // Update message with new image URLs and fetch updated + populated result in one query
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { $push: { images: { $each: urls } } },
      { new: true }
    ).populate([
      { path: "senderId", select: "_id username" },
      { path: "receiverId", select: "_id username" },
    ]);

    const updatedMessageRedis = redisSchemaHelper(updatedMessage);
    const [chatKey1, chatKey2] = redisKeyHelper(
      updatedMessage.senderId._id.toString(),
      updatedMessage.receiverId._id.toString()
    );

    // Update Redis for offline access
    await Promise.all([
      redisHelper.pushInList(chatKey1, JSON.stringify(updatedMessageRedis), 3),
      redisHelper.pushInList(chatKey2, JSON.stringify(updatedMessageRedis), 3),
    ]);

    console.log("operation successfully", updatedMessageRedis);

    res.status(200).json({ images: updatedMessage.images });
  } catch (error) {
    console.log("error operation failed", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const uploadManyFiles = async (req, res) => {
  try {
    const { messageId } = req.params;
    console.log("messageId:", messageId);

    const messageExists = await Message.exists({ _id: messageId });
    if (!messageExists) throw new Error("Message not found");

    // Upload file to Cloudinary
    const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer,"raw","pdf"));
    const urls = await Promise.all(uploadPromises);

    

    // Update message with new file URL and fetch updated + populated result in one query
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { $push: { files: { $each: urls } } } ,
      { new: true }
    ).populate([
      { path: "senderId", select: "_id username" },
      { path: "receiverId", select: "_id username" },
    ]);

  

   const updatedMessageRedis = redisSchemaHelper(updatedMessage);
   const [chatKey1, chatKey2] = redisKeyHelper(
      updatedMessage.senderId._id.toString(),
      updatedMessage.receiverId._id.toString()
    );
    // Update Redis for offline access
    await Promise.all([
      redisHelper.pushInList(chatKey1, JSON.stringify(updatedMessageRedis), 3),
      redisHelper.pushInList(chatKey2, JSON.stringify(updatedMessageRedis), 3),
    ]);
    console.log("operation successfully", updatedMessageRedis);
    res.status(200).json({ files: updatedMessage.files });
  }
  catch (error) {
    console.log("error operation failed", error.message);
    res.status(500).json({ message: error.message });
  }
}

