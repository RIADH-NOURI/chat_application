import Message from "../../../models/messages.module.js";
import redisHelper from "../../../utils/redis.helper";
import {
  redisKeyHelper,
  redisSchemaHelper,
} from "../../../utils/redisSchemaHelper";
import { SocketHandler } from "./SocketHandler";

class PrivateMessageHandler extends SocketHandler {
  constructor(socket: any, io: any, onlineUsers: any) {
    super(socket, io, onlineUsers);
  }

  socketEvents(): void {
    this.socket.on(
      "sendMessage",
      async ({ _id, text, receiverId, senderId }:{ _id: string, text: string, receiverId: string, senderId: string }) => {
        try {
          console.log("start send Message operation");

          // 1. Create initial message with empty images
          let message = new Message({
            _id,
            senderId,
            receiverId,
            text,
            images: [],
          });

          await message.save();
          console.debug(`[MongoDB] Saved message _id: ${_id}`);

          await message.populate("_id senderId receiverId", "_id username");

          const [chatKey1, chatKey2] = redisKeyHelper(senderId, receiverId);

          const updatedMessage = redisSchemaHelper(message);

          // 4. Push message to Redis for both sender and receiver

          await redisHelper.pushInList(
            chatKey1,
            JSON.stringify(updatedMessage),
            3
          );
          await redisHelper.pushInList(
            chatKey2,
            JSON.stringify(updatedMessage),
            3
          );

          console.log("redis updated successfully :", updatedMessage);

          // 5. Emit to receiver if online
          const receiverSocketId = this.getReceiverId(receiverId);

          if (receiverSocketId) {
            this.io.to(receiverSocketId).emit("newMessage", updatedMessage);
            console.log("newMessage sent to receiver");
          } else {
            console.warn(
              `[Socket] Receiver ${receiverId} is offline or socket ID not found`
            );
          }

          // 6. Confirm back to sender
          this.socket.emit("messageSent", updatedMessage);
        } catch (error) {
          console.error(`[Error][sendMessage]`, {
            error: error.message || error,
            data: { _id, senderId, receiverId, text },
          });

          this.socket.emit("error", {
            message: "Message delivery failed. Please try again.",
            code: "MESSAGE_SEND_FAILED",
          });
        }
      }
    );

    // Handle message deletion

    this.socket.on("deleteMessage", async ({ messageId, userId }) => {
      try {
        console.log("Deleting message with ID:", messageId);
        if (userId) {
          const messageUserId = await Message.findById(messageId);
          if (!messageUserId) return;

          if (!messageUserId.deletedBy.includes(userId)) {
            messageUserId.deletedBy.push(userId);
            await messageUserId.save();
            console.log("User deleted message:", messageUserId);
          }
          const [chatKey1, chatKey2] = redisKeyHelper(
            messageUserId.senderId,
            messageUserId.receiverId
          );

          await redisHelper.del(chatKey1);
          await redisHelper.del(chatKey2);

          return; // ✅ Stop here — do not continue to hard delete
        }

        const message = await Message.findByIdAndDelete(messageId);
        console.log("Deleted message:", message);
        if (!message) {
          return this.socket.emit("error", { message: "Message not found" });
        }

        const [user1, user2] = [message.senderId, message.receiverId].sort();
        const chatKey1 = `chat:${user1}-${user2}`;
        const chatKey2 = `chat:${user2}-${user1}`;
        console.log("chatKey1:", chatKey1);
        console.log("chatKey2:", chatKey2);

        // Remove the specific message from Redis
        await redisHelper.del(chatKey1);
        await redisHelper.del(chatKey2);

        // Emit event to notify both sender and receiver
        const receiverSocketId = this.getReceiverId(message.receiverId);
        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit("messageDeleted", messageId);
        }

        // Also notify the sender
        this.socket.emit("messageDeleted", messageId);
      } catch (error) {
        console.error("Error deleting message:", error);
        this.socket.emit("error", { message: "Something went wrong" });
      }
    });

    // handle reaction socket
    this.socket.on("addReaction", async ({ messageId, userId, emoji }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) {
          console.log("Message not found");
          return this.socket.emit("error", { message: "Message not found" });
        }

        let reactions = message.reactions || [];

        // Find if the user already reacted
        const userReactionIndex = reactions.findIndex(
          (r) => r.userId.toString() === userId
        );

        if (userReactionIndex !== -1) {
          // User has already reacted
          if (reactions[userReactionIndex].emoji === emoji) {
            // Same emoji => remove reaction (toggle off)
            reactions.splice(userReactionIndex, 1);
          } else {
            // Different emoji => replace reaction
            reactions[userReactionIndex].emoji = emoji;
          }
        } else {
          // No existing reaction => add new one
          reactions.push({ userId, emoji });
        }

        message.reactions = reactions;
        await message.save();

        // Invalidate Redis cache
        const chatKey1 = `chat:${message.senderId}-${message.receiverId}`;
        const chatKey2 = `chat:${message.receiverId}-${message.senderId}`;
        await redisHelper.del(chatKey1);
        await redisHelper.del(chatKey2);

        // Emit updated reaction to receiver
        const senderSocketId = this.getReceiverId(message.senderId.toString());
        const receiverSocketId = this.getReceiverId(
          message.receiverId.toString()
        );

        if (senderSocketId) {
          this.io.to(senderSocketId).emit("reactionUpdated", {
            messageId,
            reactions: message.reactions,
          });
        }

        if (receiverSocketId && receiverSocketId !== senderSocketId) {
          this.io.to(receiverSocketId).emit("reactionUpdated", {
            messageId,
            reactions: message.reactions,
          });
          console.log("Reaction updated for receiver:", receiverSocketId);
          
        }

        console.log("Updated reactions:", message.reactions);
      } catch (error) {
        console.error("Error adding reaction:", error);
        this.socket.emit("error", { message: "Failed to add reaction" });
      }
    });

    // handle users read status
    this.socket.on("addUserRead", async ({ userId, authUserId }) => {
      try {
        // Validate input
        if (!userId || !authUserId) {
          return this.socket.emit("error", { message: "Invalid user IDs" });
        }

        // Find the latest message between the two users
        const latestMessage = await Message.findOne({
          $or: [
            { senderId: userId, receiverId: authUserId },
            { senderId: authUserId, receiverId: userId },
          ],
        })
          .sort({ createdAt: -1 })
          .populate([
            { path: "senderId", select: "_id username" },
            { path: "receiverId", select: "_id username" },
            { path: "usersRead", select: "_id username" },
          ]);

        if (!latestMessage) {
          return this.socket.emit("error", { message: "No messages found" });
        }

        // Prevent the sender from marking their own message as read
        if (latestMessage.senderId._id.toString() === authUserId) {
          return;
        }

        // Check if authUserId already exists in usersRead
        const userAlreadyRead = latestMessage.usersRead.some(
          (user) => user._id.toString() === authUserId
        );
        4555;
        if (userAlreadyRead) {
          return; // Already marked as read, nothing to update
        }

        // Add the authUserId (the actual reader) to usersRead
        const updatedMessage = await Message.findByIdAndUpdate(
          latestMessage._id,
          {
            $addToSet: { usersRead: authUserId },
            $set: { isRead: true },
          },
          {
            new: true,
          }
        ).populate([
          { path: "senderId", select: "_id username" },
          { path: "receiverId", select: "_id username" },
          { path: "usersRead", select: "_id username" },
        ]);

        console.log("Updated message with new reader:", updatedMessage);

        // Update Redis for both users
        const [chatKey1, chatKey2] = redisKeyHelper(
          updatedMessage.senderId._id,
          updatedMessage.receiverId._id
        );

        const redisMessage = redisSchemaHelper(updatedMessage);

        await Promise.all([
          redisHelper.pushInList(chatKey1, JSON.stringify(redisMessage), 3),
          redisHelper.pushInList(chatKey2, JSON.stringify(redisMessage), 3),
        ]);

        console.info(`[Redis] Updated message in ${chatKey1} and ${chatKey2}`);

        // Notify receiver if they are online
        const receiverSocketId = this.getReceiverId(
          updatedMessage.receiverId._id.toString()
        );

        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit("messageRead", {
            messageId: updatedMessage._id,
            usersRead: updatedMessage.usersRead,
          });
          console.log("messageRead event sent to receiver", updatedMessage);
        }
      } catch (error) {
        console.error("Error marking message as read:", error);
        this.socket.emit("error", {
          message: "Failed to mark message as read",
        });
      }
    });

    // handle updated images into the message

    this.socket.on("updatedMessageImages", async ({ messageId, images }) => {
      try {
        let message = await Message.findById(messageId);

        if (!message) {
          return this.socket.emit("error", {
            message: "Message not found",
            code: "MESSAGE_NOT_FOUND",
          });
        }

        console.log("updated images message db socket :", message);

        await message.populate([
          { path: "senderId", select: "_id username" },
          { path: "receiverId", select: "_id username" },
        ]);
        const [chatKey1, chatKey2] = redisKeyHelper(
          message.senderId,
          message.receiverId
        );

        const updatedMessage = redisSchemaHelper(message);

        await redisHelper.pushInList(
          chatKey1,
          JSON.stringify(updatedMessage),
          3
        );
        await redisHelper.pushInList(
          chatKey2,
          JSON.stringify(updatedMessage),
          3
        );

        console.log("updated message images redis success :", updatedMessage);

        const receiverSocketId = this.getReceiverId(
          message.receiverId._id.toString()
        );
        console.log("receiverSocketId :", receiverSocketId);

        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit("messageImagesUpdated", {
            _id: message?._id,
            images: images,
          });
        }

        this.socket.emit("imagesUpdated", {
          messageId: message._id,
          images: message.images,
        });
      } catch (error) {
        console.error(`[Error][updatedMessageImages]`, error.message);
        this.socket.emit("error", {
          message: "Failed to update message images",
          code: "IMAGE_UPDATE_FAILED",
        });
      }
    });
  }
}

export { PrivateMessageHandler };
