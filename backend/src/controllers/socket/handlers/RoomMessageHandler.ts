import { SocketHandler } from "./SocketHandler";
import redisHelper from "../../../utils/redis.helper.js";
import Room from "../../../models/room.module.js";
import RoomMessage from "../../../models/roomMessage.module.js";
import { roomRedisSchemaHelper } from "../../../utils/redisSchemaHelper.js";

abstract class RoomMessageHandler extends SocketHandler {

    constructor(socket: any, io: any, onlineUsers: any) {
      super(socket,io,onlineUsers)
    }

    socketEvents(): void {
        // Join Room Handler
        this.socket.on("joinRoom", async ({ roomId, userIds }: { roomId: string, userIds: string | string[] }) => {
            if (!Array.isArray(userIds)) userIds = [userIds]; // Ensure it's an array

            this.socket.join(roomId);

            // Fetch updated user list from DB
            const room = await Room.findById(roomId).populate("users", "username");
            if (room) {
                this.io.to(roomId).emit("roomUsersUpdated", { users: room.users });
            }
        });

        // Send Message Room Handler
        this.socket.on("sendMessageRoom", async ({ _id, roomId, senderId, text }: { _id: string, roomId: string, senderId: string, text: string }) => {
            console.log("Received message data:", { roomId, senderId, text });

            try {
                if (!roomId || !senderId || !text) {
                    console.error("Missing required fields:", { roomId, senderId, text });
                    return;
                }
                const roomkey = `room:${roomId}`;
                let message = new RoomMessage({ _id, senderId, roomId, text });
                await message.save();
                await message.populate(
                    { path: "senderId", select: "_id username picture" }
                );
                const updatedRedisMessage = roomRedisSchemaHelper(message);
                await redisHelper.pushInList(roomkey, JSON.stringify(updatedRedisMessage), 3);
                await Room.findByIdAndUpdate(roomId, { $push: { messages: message } });

                this.io.to(roomId).emit("newMessageRoom", updatedRedisMessage);
                console.log("Message sent successfully:", updatedRedisMessage);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        // Update Room Message Images Handler
        this.socket.on("sendMessageRoomImages", async ({ roomId, messageId, images }: { roomId: string, messageId: string, images: string[] }) => {
            try {
                let message = await RoomMessage.findById(messageId);

                if (!message) {
                    return this.socket.emit("error", {
                        message: "Message not found",
                        code: "MESSAGE_NOT_FOUND",
                    });
                }

                console.log("updated images message db socket :", message);

                await message.populate([
                    { path: "senderId", select: "_id username picture" },
                ]);
                const roomKey = `room:${message.roomId}`;

                const updatedMessage = roomRedisSchemaHelper(message);
                await redisHelper.pushInList(roomKey, JSON.stringify(updatedMessage), 3);

                console.log("updated message images redis success :", updatedMessage);

                this.io.to(roomId).emit("updatedRoomMessageImages",
                    {
                        _id: message._id,
                        images,
                    }
                );

            } catch (error) {
                console.error(`[Error][updatedMessageImages]`, error);
                this.socket.emit("error", {
                    message: "Failed to update message images",
                    code: "IMAGE_UPDATE_FAILED",
                });
            }
        });

        // Delete Message Room Handler
        this.socket.on("deleteMessageRoom", async ({ roomId, messageId, userId }: { roomId: string, messageId: string, userId?: string }) => {
            console.log("delete message room socket", { roomId, messageId, userId });
            try {
                if (userId) {
                    const message = await RoomMessage.findById(messageId);
                    if (!message) {
                        return this.socket.emit("error", {
                            message: "Message not found",
                            code: "MESSAGE_NOT_FOUND",
                        });
                    }
                    const existingUser = message.deletedBy.includes(userId);
                    if (existingUser) {
                        return this.socket.emit("error", {
                            message: "Message already deleted",
                            code: "MESSAGE_ALREADY_DELETED",
                        });
                    }
                    message.deletedBy.push(userId);
                    await message.save();
                    console.log("Message deleted successfully", message);

                    await redisHelper.del(`room:${roomId}`);

                    return;
                }

                const deleteMessage = await RoomMessage.findByIdAndDelete(messageId);
                if (!deleteMessage) {
                    return this.socket.emit("error", {
                        message: "Message not found",
                        code: "MESSAGE_NOT_FOUND",
                    });
                }
                console.log("Message deleted successfully", deleteMessage);
                const roomKey = `room:${roomId}`;
                console.log("delete message redis key", roomKey);
                await redisHelper.del(roomKey);
                this.io.to(roomId).emit("deleteMessageRoom", messageId);
            } catch (error) {
                console.error(`[Error][deleteMessageRoom]`, error);
                this.socket.emit("error", {
                    message: "Failed to delete message",
                    code: "MESSAGE_DELETE_FAILED",
                });
            }
        });

        // Add Reaction Room Handler
        this.socket.on("addRoomReaction", async ({ roomId, messageId, userId, emoji }: { roomId: string, messageId: string, userId: string, emoji: string }) => {
            try {
                const message = await RoomMessage.findById(messageId);
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
                        console.log("Reaction removed successfully");
                    } else {
                        // Different emoji => replace reaction
                        reactions[userReactionIndex].emoji = emoji;
                        console.log("Reaction replaced successfully");
                    }
                } else {
                    // No existing reaction => add new one
                    reactions.push({ userId, emoji });
                }

                message.reactions = reactions;
                await message.save();

                console.log("Reaction added successfully", message);

                await redisHelper.del(`room:${roomId}`);
                this.io.to(roomId).emit("roomReactionAdded", { messageId, reactions });
            } catch (error) {
                console.error("Error adding reaction:", error);
                this.socket.emit("error", { message: "Failed to add reaction" });
            }
        });

        // Update User Read Room Handler
        this.socket.on("updatedUserReadRoom", async ({ roomId, userId }: { roomId: string, userId: string }) => {
            try {
                const latestMessage = await RoomMessage.findOne().limit(1).sort({ createdAt: -1 });
                if (!latestMessage) {
                    return this.socket.emit("error", {
                        message: "Room not found",
                        code: "ROOM_NOT_FOUND",
                    });
                }

                await RoomMessage.findByIdAndUpdate(
                    latestMessage._id,
                    { isRead: true },
                    { new: true }
                );

                if (!latestMessage) return;
                if (latestMessage.usersRead.includes(userId)) return;

                latestMessage.usersRead.push(userId);
                await latestMessage.save();
                await redisHelper.popFromList(`room:${roomId}`);

                console.log("Users read updated successfully");

                this.io.to(roomId).emit("userRoomReadUpdated", userId);
            } catch (error) {
                console.error(`[Error][updatedUsersReadRoom]`, error);
                this.socket.emit("error", {
                    message: "Failed to update users read",
                    code: "UPDATE_USERS_READ_FAILED",
                });
            }
        });
    }
}

export  {RoomMessageHandler};