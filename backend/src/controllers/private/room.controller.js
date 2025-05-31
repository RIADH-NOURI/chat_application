import redisHelper from "../../utils/redis.helper.js";
import Room from "../../models/room.module.js";
import RoomMessage from "../../models/roomMessage.module.js";


export const createOrJoinRoom = async (req, res) => {
    try {
        const { roomName: name, usersIds } = req.body;

        if (!name || !usersIds) {
            return res.status(400).json({ message: "Name and userIds are required" });
        }
        // Check if a room with the given name exists
        let room = await Room.findOne({ name });

        if (!room) {
            // Create a new room if it doesn't exist
            room = new Room({ name, users: usersIds || [] });
            await room.save();
            return res.status(201).json({ message: "Room created successfully", room });
        }

        // If the room exists, add users to it
        const newUsers = usersIds?.filter(userId => !room.users.includes(userId)) || [];

        if (newUsers.length > 0) {
            room.users.push(...newUsers);
            await room.save();
        }

        res.json({ message: "Users joined the room successfully", room:{
            _id: room._id,
            name: room.name,
            users: room.users
        } });

    } catch (error) {
        res.status(500).json({ error: "Failed to create or join room" });
    }
};

export const getRoomUsers = async(req, res) => {
    try {

        const { roomId } = req.params;
        const {page=1,limit=10} = req.query;
        const totalMessages = await RoomMessage.countDocuments({roomId});
        const totalPages = Math.ceil(totalMessages / parseInt(limit));
        const hasMore = parseInt(page) < totalPages;
        const room = await Room.findById(roomId).select("_id name").populate("users", "username picture").skip((page-1)*limit).limit(limit);
        if (!room) return res.status(404).json({ error: "Room not found" });
        res.json({
            pagination:{
                totalPages,
                currentPage:parseInt(page),
                limit:parseInt(limit),
                hasMore
            },
            room
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to get room users" });
    }
};

export const getRoomById = async (req, res) => {
    try {
      const { id: roomId } = req.params;
      const { page = 1, limit = 10 } = req.query;
  
      const numericPage = parseInt(page);
      const numericLimit = parseInt(limit);
  
      const totalMessages = await RoomMessage.countDocuments({ roomId });
      const totalPages = Math.ceil(totalMessages / numericLimit);
  
      const roomKey = `room:${roomId}`;
      const cachedRoomMessages = await redisHelper.getList(roomKey);
  
      const redisMessages = cachedRoomMessages
      ? cachedRoomMessages
          .map(msg => JSON.parse(msg)).sort((a,b)=> new Date(a.createdAt)-new Date(b.createdAt))
      : [];
    
    // 2. Fetch DB messages sorted by latest first
    const allMessages = await RoomMessage.find({ roomId,deletedBy:{$ne:req.user._id}})
      .populate([
        { path: "senderId", select: "_id username picture" },
      ])
      .sort({ createdAt: -1 });
    
    // 3. Remove redis duplicates from DB
    const redisIds = redisMessages.map(msg => msg._id.toString());

    // Filter out messages from DB that are already in Redis
    const filteredAllMessages = allMessages.filter(
      msg => !redisIds.includes(msg._id.toString())
    );

    const reversedAllMessages = filteredAllMessages.reverse();

    
    // 4. Combine DB first, Redis after (both already sorted desc)
    const allCombined = [...filteredAllMessages,...redisMessages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      // ✅ Correct pagination for array:
      const startIndex = (numericPage - 1) * numericLimit;
      const endIndex = startIndex + numericLimit;
      const paginatedMessages = allCombined.slice(startIndex, endIndex);

      const hasMore = endIndex < allCombined.length;
  
      // Cache new messages to Redis if not already there
      for (const message of reversedAllMessages) {
        const msgStr = JSON.stringify(message);
        const isAlreadyInRedis = redisMessages.some(msg => msg === msgStr);
        if (!isAlreadyInRedis) {
          await redisHelper.pushInList(roomKey, msgStr, 3);
        }
      }
  
      const room = await Room.findById(roomId)
        .populate([
          { path: "users", select: "_id username picture" }
        ])
        .select("-messages");
  
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
  
      res.json(
        {
          pagination: {
            totalPages,
            currentPage: numericPage,
            limit: numericLimit
          },
          hasMore,
          room: {
            _id: room._id,
            name: room.name,
            users: room.users.slice(0, 4)
          },
          messages: paginatedMessages
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  };
  
export const allRooms = async(req, res) => {
    try {
      const rooms = await Room.find().select("_id name");
      res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
export const getRoomsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const {page=1,limit=10,search=""} = req.query;
        const totalRooms = await Room.countDocuments({ users: userId,name:{$regex:search,$options:"i"}});
        const totalPages = Math.ceil(totalRooms / parseInt(limit));
        const hasMore = parseInt(page) < totalPages;


        const rooms = await Room.find({ users: userId,name:{$regex:search,$options:"i"}} )
            .select("users _id name")
            .populate(
              {
                path: "users",
                select: "_id username picture",
              }
            )
            .skip((page-1)*limit).limit(limit);
        res.json({
            pagination:{
                totalPages,
                currentPage:parseInt(page),
                limit:parseInt(limit),
            },
            hasMore,
            rooms
        });
    } catch (error) {   
        res.status(500).json({ error: "Failed to fetch rooms" });
    }
};

export const getAvailableRooms = async (req, res) => {
  try {
      const loginId = req.user._id;
      const { page = 1, limit = 10, search = "" } = req.query;

      const totalRooms = await Room.countDocuments({
          users: { $ne: loginId },
          name: { $regex: search, $options: "i" }
      });

      const totalPages = Math.ceil(totalRooms / parseInt(limit));
      const hasMore = parseInt(page) < totalPages;

      const rooms = await Room.find({
          users: { $ne: loginId },
          name: { $regex: search, $options: "i" }
      })
      .select("_id name")
      .populate({
          path: "users",
          select: "_id username picture",
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

      res.json({
          pagination: {
              totalPages,
              currentPage: parseInt(page),
              limit: parseInt(limit),
          },
          hasMore,
          rooms
      });
  } catch (error) {
      res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

export const addUserInTheRoom = async(req,res)=>{
  try {
    const {userId} = req.body;
    const {roomId} = req.params;
    const room = await Room.findById(roomId);

    const existUser = room.users.includes(userId)
    if(existUser){
      return res.status(400).json({message:"User already exists"});
    }
    room.users.push(userId);
    await room.save();
    console.log("user added in the room successfully",room);
    
    res.json({message:"User added successfully",room});
    
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Something went wrong",
      error:message.error
    });
  }
}
export const getLatestMessageFromRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await RoomMessage.find({ roomId })
      .sort({ createdAt: -1 })
      .limit(1)

    res.json(messages[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

