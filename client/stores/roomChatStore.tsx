import { baseUrl } from "@/hooks/useFetch";
import { queryClient } from "@/app/_layout";
import { create } from "zustand";
import mongoose from "mongoose";
import { usersStore } from "./usersStore";
import { authStore } from "./authStore";
import { io } from "socket.io-client";
import { updateDeleteMessageCache,UpdateNewImagesCache,updateReactionSubscribeSocketCache,updateUsersReadCache,updateUsersReadSubscribeSocketCache,updateReactionsCache,updateNewMessageCache} from "@/utils/updateCacheLogic";
import { uploadImagesToServer } from "@/utils/uploadFilesToServer";
import { RoomMessage } from "@/types";


const { ObjectId } = mongoose.Types;
const socket = io("http://192.168.1.39:5000");


interface RoomChatStore {

  selectedRoomId: string | null;
  isLoading: boolean;
  getRoomsByUser: (userId: string,page:number,limit:number,search:string) => Promise<any>;
  getRoomById: (roomId: string, page?: number) => Promise<void>;
  getRooms: (page:number,limit:number,search:string) => Promise<any>;
  subscribeRoomMessages: () => void;
  joinRoomSocket:  (roomId: string,userIds:string[] ) => void;
  sendMessageInRoom: (text: string, senderId: string, roomId: string, images?: string[]) => void;
  createAndJoinRoom: (data: { roomName: string; users: string[] }) => Promise<any>;
  setSelectedRoomId: (roomId: string) => void;
  deleteMessageFromRoom: (roomId: string, messageId: string,userId?:string) => void;
  addRoomReaction: (roomId: string, messageId: string, userId: string, emoji: string) => void;
  addUserReadInRoom: (roomId: string, userId: string) => void;
  addUserInTheRoom :(userId : string,roomId:string) => void
  getLatestMessageFromRoom: (roomId: string) => Promise<any>;

}

export const roomChatStore = create<RoomChatStore>((set, get) => ({
  isLoading: false,
  messages: [],
  selectedRoomId: null,


  setSelectedRoomId: (roomId) => {
    set({ selectedRoomId: roomId });
  },

  getRoomById: async (roomId, page = 1) => {
    try {
      const response = await baseUrl.get(`/room/${roomId}?page=${page}&limit=10`);
      return response.data
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  },
  getRoomsByUser: async (userId,page,limit,search) => {
    try {
      const response = await baseUrl.get(`/user/rooms/${userId}?page=${page}&limit=${limit}&search=${search}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching room users:", error);
    }
  },
  getLatestMessageFromRoom: async (roomId) => {
    try {
      const response = await baseUrl.get(`/room/latest/message/${roomId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching latest message from room:", error);
    }
  },


  createAndJoinRoom: async (data) => {
    try {
      const response = await baseUrl.post("/create/room", data);
      return response.data;
    } catch (error) {
      console.error("Error creating room:", error);
    }
  },
  addUserInTheRoom: async (userId,roomId) => {
    try {
      const response = await baseUrl.post(`/room/add/user/${roomId}`, { userId });
      return response.data;
    } catch (error) {
      console.error("Error adding user in the room:", error);
    }
  },

  getRooms: async (page,limit,search) => {
    try {
      const response = await baseUrl.get(`/rooms?page=${page}&limit=${limit}&search=${search}`);
      return response.data;
    } catch (error) {
      console.error("Error getting rooms:", error);
    }
  },

  joinRoomSocket: ( roomId,userIds) => {
    const senderId = authStore.getState().authUser?._id;
    const currentUser = usersStore.getState().user;

   // if (!senderId || !currentUser) {
   //   console.error("User not authenticated or data missing");
   //   return;
   // }

    socket.emit("joinRoom", { roomId, userIds });
  },

  sendMessageInRoom:async (text, senderId, roomId, images = []) => {
    const currentUser = usersStore.getState().authUserInfo;
    const selectedRoomId = get().selectedRoomId;

    if (!senderId || !currentUser) {
      console.error("User not authenticated or data missing");
      return;
    }

    const tempId = new ObjectId().toString();

    const newMessageRoom: RoomMessage = {
      _id: tempId,
      senderId: {
        _id: senderId,
        username: currentUser.username,
        picture: currentUser.picture || "",
      },
      roomId,
      text,
       images:[],
      files: [],
      deletedBy: [],
      reactions:[],
      createdAt: new Date().toISOString(),
    };

    // Optimistic update

    queryClient.setQueryData(["roomData",selectedRoomId],(oldData : any)=>{
       return updateNewMessageCache(oldData,newMessageRoom)
    })
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "latestMessageFromRoom",
    });
    socket.emit("sendMessageRoom", {
      _id: tempId,
      text,
      senderId,
      roomId,
    });

    // 3. Upload images if any
    if (images && images.length > 0) {
      try {
        if (tempId) {
          const uploadedImageUrls = await uploadImagesToServer(
            tempId,
            images
          );
          socket.emit("sendMessageRoomImages", {
            roomId,
            messageId: tempId,
            images: uploadedImageUrls,
          });

          queryClient.setQueryData(
            ["roomData", selectedRoomId],
            (oldData: any) => {
             return  UpdateNewImagesCache(oldData, tempId, uploadedImageUrls)
            }
          );
        }

        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "latestMessage",
        });
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "latestMessageFromRoom",
        });

        set({ isLoading: false });
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
    set({ isLoading: false });
  },
  // delete Message from room 

  deleteMessageFromRoom: async (roomId,messageId,userId) => {
    const socket = authStore.getState().socket;
    const selectedRoomId = get().selectedRoomId;
    try {
   

    queryClient.setQueryData(["roomData", selectedRoomId], (oldData: any) => {
      return updateDeleteMessageCache(oldData, messageId)
    });
    } catch (error) {
      console.error("Error deleting message:", error);
    }

    if (socket && socket.connected) {
      set({ isLoading: true });
      socket.emit("deleteMessageRoom", { roomId, messageId,userId });
      set({ isLoading: false });
    }
  },

  // add ReactionMessage in the room 

  addRoomReaction: (roomId,messageId, userId, emoji) => {
    const socket = authStore.getState().socket;
    const selectedRoomId = get().selectedRoomId;

    console.log("roomId", selectedRoomId);
    

    // Get all cached keys for this conversation
   queryClient.setQueryData(["roomData", selectedRoomId], (oldData: any) => {
    const reactions = oldData?.pages[0]?.messages?.find((msg: any) => msg?._id === messageId)?.reactions || [];
    console.log("reactions updated", reactions);
    
    
      return updateReactionsCache(oldData, messageId, userId, emoji)
    });
    

    // Emit reaction to server
    if (socket && socket.connected) {
      socket.emit("addRoomReaction", { roomId,messageId, userId, emoji });
    }
  },

  // added usersRead in the room 

  addUserReadInRoom: (roomId,userId) => {
    const socket = authStore.getState().socket;
    const authUserId = authStore.getState().authUser?._id;
    const selectedRoomId = get().selectedRoomId;
  
    queryClient.setQueryData(["roomData", selectedRoomId], (oldData: any) => {
     return updateUsersReadCache(oldData,authUserId)
    });
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "latestMessageFromRoom",
    });
  
    if (socket && socket.connected) {
      socket.emit("updatedUserReadRoom", { roomId,userId });
      console.log("Emitting addReadedUserId", { userId, authUserId });
    }
  },


  subscribeRoomMessages: () => {
    const selectedRoomId = get().selectedRoomId;
    if (!socket || !socket.connected) {
      console.error("WebSocket not connected");
      return;
    }

    socket.on("newMessageRoom", (newMsg: RoomMessage) => {
       queryClient.setQueryData(["roomData",selectedRoomId],(oldData : any)=>{
        return updateNewMessageCache(oldData,newMsg)
       })
      queryClient.setQueryData(["latestMessageFromRoom",selectedRoomId],newMsg)
    });
    // 
    socket.on("updatedRoomMessageImages", (updatedMessage: RoomMessage) => {
      queryClient.setQueryData(["messages", selectedRoomId], (old: any) => {
        return updateNewImagesCache(old, updatedMessage._id, updatedMessage.images)
      });
    });
    // 
    socket.on("deleteMessageRoom", (messageId: string) => {
      queryClient.setQueryData(["roomData", selectedRoomId], (oldData: any) => {
       return updateDeleteMessageCache(oldData, messageId)
      });
    });
    // 
    socket.on("roomReactionAdded", (reactionData: any) => {
      queryClient.setQueryData(["roomData", selectedRoomId], (oldData: any) => {
        return updateReactionSubscribeSocketCache(oldData, reactionData)
      });
    });
    // 
    socket.on("userRoomReadUpdated", (data: any) => {
      queryClient.setQueryData(["roomData", selectedRoomId], (oldData: any) => {
        return updateUsersReadCache(oldData,data)
      });
    });
  },
}));
