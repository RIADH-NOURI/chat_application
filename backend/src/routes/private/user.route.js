

import {updateUser,getUserById,getUsers,updateUserPicture,addFriend,getUserFriends,joinUserInRooms,getAllUsers} from "../../controllers/private/user.controller.js";


import express from 'express';

import uploadMiddleware from "../../middlewares/uploadMiddleware.js";
const router = express.Router();

router.put('/update/user/:id', updateUser);
router.get('/user/:id', getUserById);
router.get('/users', getUsers);
router.put('/update/user/picture/:id',  uploadMiddleware.single("picture"), updateUserPicture);
router.post('/user/add/friend',  addFriend);
router.get('/user/friends/:id',  getUserFriends);
router.post('/user/join/room',  joinUserInRooms);
//router.get('/user/rooms/:id', authentication, getRoomsByUser);
router.get('/all/users',  getAllUsers);
export default router;