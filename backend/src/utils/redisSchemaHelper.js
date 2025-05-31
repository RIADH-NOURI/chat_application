

export const redisSchemaHelper = (message)=>{
    return {
        _id: message._id.toString(),
        senderId: {
            _id: message.senderId._id.toString(),
            username: message.senderId.username,
        },
        receiverId: {
            _id: message.receiverId._id.toString(),
            username: message.receiverId.username,
        },
        text: message.text,
        files: message.files,
        deletedBy: message.deletedBy,
        images: message.images,
        isRead: message.isRead,
        usersRead: message.usersRead,
        createdAt: message.createdAt,
        reactions: message.reactions,
    }
}

export const roomRedisSchemaHelper = (message)=>{
    return {
        _id: message._id.toString(),
        senderId: {
            _id: message.senderId._id.toString(),
            username: message.senderId.username,
            picture: message.senderId.picture,
        },
        roomId: message.roomId.toString(),
        text: message.text,
        deletedBy: message.deletedBy,
        images: message.images,
        isRead: message.isRead,
        usersRead: message.usersRead,
        createdAt: message.createdAt,
        reactions: message.reactions,
    }

}

export const redisKeyHelper = (senderId, receiverId) => {
    
    const [user1, user2] = [senderId, receiverId].sort();
    const chatKey1 = `chat:${user1}-${user2}`;
    const chatKey2 = `chat:${user2}-${user1}`;
    return [chatKey1, chatKey2];
}