import Message from "../../models/messages.module.js";
import redisHelper from "../../utils/redis.helper.js";

export const getMessages = async (req, res) => {
  try {
    const { id: userId } = req.params;
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const chatKey1 = `chat:${req.user._id}-${userId}`;
    const chatKey2 = `chat:${userId}-${req.user._id}`;

    // Try to fetch last 3 messages from Redis
    let cachedMessages = await redisHelper.getList(chatKey1);
    if (!cachedMessages || cachedMessages.length === 0) {
      cachedMessages = await redisHelper.getList(chatKey2);
    }
    const totalMessages = await Message.countDocuments({
      $or: [
        { senderId: userId, receiverId: req.user._id },
        { senderId: req.user._id, receiverId: userId },
      ],
      deletedBy: { $ne: req.user._id },
    });
    const totalPages = Math.ceil(totalMessages / parseInt(limit));

    const redisMessages = cachedMessages
      ? cachedMessages
          .map((msg) => JSON.parse(msg))
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) 
      : [];

    // Fetch all messages from MongoDB
    const allMessages = await Message.find({
      $or: [
        { senderId: userId, receiverId: req.user._id },
        { senderId: req.user._id, receiverId: userId },
      ],
      deletedBy: { $ne: req.user.id },
    })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "senderId",
          select: "_id username picture",
        },
        {
          path: "usersRead",
          select: "_id username picture",
        },
        {
          path: "receiverId",
          select: "_id username picture",
        }
      ])
      

    // Remove duplicates by comparing MongoDB messages with Redis messages
    const redisIds = redisMessages.map((msg) => msg._id.toString());
    const filteredAllMessages = allMessages.filter(
      (msg) => !redisIds.includes(msg._id.toString())
    );

  const reversedAllMessages = filteredAllMessages.reverse();

    // Combine MongoDB and Redis messages (avoid duplicates and sort by createdAt)
    const allCombined = [, // Latest 3 messages from Redis
      ...filteredAllMessages,
      ...redisMessages // Rest from MongoDB
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort all combined messages by createdAt

    // Apply pagination using slice
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const sliced = allCombined.slice(startIndex, endIndex).filter(msg => msg != null);
    const paginatedMessages = sliced.length > 0 ? sliced : [];
    const hasMore = endIndex < allCombined.length;

    // If MongoDB messages are newer, push them to Redis (only store 3 most recent messages)
    for (const message of reversedAllMessages) {
      const msgStr = JSON.stringify(message);
      // Only push the message to Redis if it's not already there
      const isAlreadyInRedis = cachedMessages.some((msg) => msg === msgStr);
      if (!isAlreadyInRedis) {
        await redisHelper.pushInList(chatKey1, msgStr, 50); // Add to Redis (for the current user)
        await redisHelper.pushInList(chatKey2, msgStr, 50); // Add to Redis (for the other user)
      }
    }
    res.json({
      pagination: {
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
      hasMore,
      messages: paginatedMessages,
    });
  } catch (error) {
    console.error("Error fetching messages:");
    res.status(500).json({ message: "Something went wrong",error:error.message });
  }
};

export const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLatestMessages = async (req, res) => {
  try {
    const { id: userId } = req.params;

    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }

    const allMessages = await Message.find({
      $or: [
        { senderId: userId, receiverId: req.user._id },
        { senderId: req.user._id, receiverId: userId },
      ]
    }).sort({createdAt:-1})
    .limit(1)
    .populate([
      {
        path: "senderId",
        select: "_id",
      },
      {
        path: "receiverId",
        select: "_id",
      },
    ]);
    res.status(200).json(allMessages[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getImagesByMessageId = async (req,res)=>{
   try {
     const {id:messageId} = req.params;
     if (!messageId) {
      return res.status(404).json({
        message:"Message not found"
      })
     }
     const MessageId = await Message.findById(messageId);
     const imagesUrls = MessageId.images;
     res.status(200).json(
     { images:imagesUrls}
     );

   } catch (error) {
      res.status(500).json({
        message:"Something went wrong",
        error:error.message
      })
   }
}

