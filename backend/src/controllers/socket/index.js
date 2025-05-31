// sockets/index.js

import { PrivateMessageHandler } from "./handlers/privateMessageHandler.ts";
import { RoomMessageHandler } from "./handlers/RoomMessageHandler.ts";


let onlineUsers = {};

function emitOnlineUsers(io, users) {
  io.emit("getOnlineUsers", users);
}

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) {
      onlineUsers[userId] = socket.id;
      emitOnlineUsers(io, Object.keys(onlineUsers));
    }

    // Instantiate and register handlers
    const privateHandler = new PrivateMessageHandler(socket, io, onlineUsers);
    privateHandler.socketEvents();

    const roomHandler = new RoomMessageHandler(socket, io,onlineUsers);
    roomHandler.socketEvents();

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
      if (userId) {
        delete onlineUsers[userId];
        emitOnlineUsers(io, Object.keys(onlineUsers));
      }
    });
  });
}


export {setupSocket}

