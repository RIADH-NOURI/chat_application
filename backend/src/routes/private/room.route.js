import express from "express";

import {
  createOrJoinRoom,
  getRoomUsers,
  getRoomById,
  allRooms,
  getRoomsByUser,
  getAvailableRooms,
  addUserInTheRoom,
  getLatestMessageFromRoom
} from "../../controllers/private/room.controller.js";
const router = express.Router();

router.post("/create/room",createOrJoinRoom);
router.get("/room/users/:roomId", getRoomUsers);
router.get("/room/:id", getRoomById);
router.get("/all/rooms", allRooms);
router.get("/user/rooms/:userId", getRoomsByUser);
router.get("/rooms", getAvailableRooms);
router.post("/room/add/user/:roomId", addUserInTheRoom);
router.get("/room/latest/message/:roomId", getLatestMessageFromRoom); 
export default router;
