import { baseUrl } from "@/hooks/useFetch";
import { create } from "zustand";
import { sendMessage, SendMessage } from "./sendMessage";
import { addUserReadId } from "./addUserRead";
import { addReaction } from "./addReaction";
import { deleteMessage } from "./deleteMessage"; // ✅ Added missing import
import { authStore } from "../authStore";
import {
  updateDeleteMessageCache,
  UpdateNewImagesCache,
  updateNewMessageCache,
  updateReactionSubscribeSocketCache,
  updateUsersReadSubscribeSocketCache,
} from "@/utils/updateCacheLogic";
import { queryClient } from "@/app/_layout";
import { usersStore } from "../usersStore";
import { uploadImagesToServer } from "@/utils/uploadFilesToServer";
import { chatUiStore } from "../chatUiStaore";
import mongoose from "mongoose"
import { PrivateChatMessage, privateChatResponse } from "@/types";

const {ObjectId} = mongoose.Types



interface PrivateChatStore {
  selectedUserId: string | null;
  isLoading: boolean;
  setSelectedUserId: (id: string) => void;
  getMessages: (messageId: string, page: number) => Promise<void>;
  getLatestMessage: (messageId: string) => Promise<void>;
  getImagesByMessageId :(messageId : string) => void
  addUserReadId: (userId: string[]) =>Promise<void>;
  addReaction: (messageId: string, userId: string, emoji: string) => void;
  deleteMessage: (messageId: string, userId?: string) => void;
  sendMessage: (
    text: string,
    receiverId: string,
    receiverName: string,
    files?: string[]
  ) => void;
  subscribePrivateMessages: () => void;
  unsubscribeMessages: () => void;
}

export const privateChatStore = create<PrivateChatStore>((set, get) => ({
  selectedUserId: null,
  isLoading: false,

  setSelectedUserId: (id) => set({ selectedUserId: id }),

  getImagesByMessageId:async(messageId)=>{
    try{
      const response  = await baseUrl.get(`/private/images/${messageId}`)
      return response.data
    }
    catch(error){
      console.error(`Error fetching images by:${messageId}`, error);
    }
  },

  getMessages: async (messageId: string, page: number) => {
    try {
      const response = await baseUrl.get(
        `/private/messages/${messageId}?page=${page}&limit=10`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  },

  getLatestMessage: async (messageId: string) => {
    try {
      const response = await baseUrl.get(
        `/private/messages/${messageId}/latest`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching latest message:", error);
    }
  },

  sendMessage: async (
    text: string,
    receiverId: string,
    receiverName: string,
    files?: string[]
  ) => {
    
    const socket = authStore.getState().socket;
    const senderId = authStore.getState().authUser?._id;
    const currentUser = usersStore.getState().user;
    const senderInfo = usersStore.getState().authUserInfo
    const selectedUserId = privateChatStore.getState().selectedUserId;
    const typeFile = chatUiStore.getState().typeFile;
  
    if (!senderId || !currentUser) {
      console.error("User not authenticated or data missing");
      return;
    }
  
    const newMessageId = new ObjectId().toString();
  
    const newMessage: PrivateChatMessage = {
      _id: newMessageId,
      senderId: {
        _id: senderId,
       username: senderInfo.username,
        picture: senderInfo.picture,
      },
      receiverId: {
        _id: receiverId,
        username: receiverName,
        picture: currentUser.picture,
      },
      deletedBy: [],
      isRead: false,
      usersRead: [],
      files:[],
      reactions: [],
      text,
      images: [],
      createdAt: new Date().toISOString(),
    };
  
    try {
      queryClient.setQueryData(["messages", selectedUserId], (oldData: PrivateChatMessage[] = []) =>
        updateNewMessageCache(oldData, newMessage)
      );
  
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "latestMessage",
      });
  
      if (socket && socket.connected) {
        // Send initial message
        socket.emit("sendMessage", {
          _id: newMessageId,
          text,
          receiverId,
          senderId,
          images: [],
        });
  
        if (files && files.length > 0) {
          try {
            set({ isLoading: true });
  
            const uploadedImageUrls = await uploadImagesToServer({
              messageId: newMessageId,
              files,
              typeFile,
              typeApi: "privateChat",
            });
            
  
            socket.emit("updatedMessageImages", {
              
                messageId: newMessageId,
                ...(typeFile === "image"
                  ? { images: uploadedImageUrls }
                  : { files: uploadedImageUrls }),
              
             
              
            });
  
            queryClient.setQueryData(["messages", selectedUserId], (oldData: PrivateChatMessage[] = []) =>
              UpdateNewImagesCache(oldData, newMessageId, uploadedImageUrls,typeFile )
            );
          } catch (error) {
            console.error("Image upload failed:", error);
          } finally {
            set({ isLoading: false });
          }
        }
      } else {
        console.error("WebSocket not connected");
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error in sendMessage:", error);
      set({ isLoading: false });
    }
  },

  addUserReadId: (userId) => {
    const socket = authStore.getState().socket;
    const authUserId = authStore.getState().authUser?._id;
    const selectedId = get().selectedUserId;
    addUserReadId(get, userId, authUserId, socket, selectedId);
  },

  addReaction: (messageId, userId, emoji) => {
    addReaction(get, messageId, userId, emoji);
  },

  deleteMessage: (messageId, userId) => {
    deleteMessage(get, set, messageId, userId);
  },
  subscribePrivateMessages: () => {
    const typeFile = chatUiStore.getState().typeFile;
    const selectedId = get().selectedUserId;
    const socket = authStore.getState().socket;

    if (!socket || !socket.connected) {
      console.error("WebSocket not connected");
      return;
    }

    socket.on("newMessage", (newMsg: PrivateChatMessage) => {
      // Update paginated messages
      queryClient.setQueryData(["messages", selectedId], (oldData: any) => {
        return updateNewMessageCache(oldData, newMsg);
      });

      // Update latest message
      queryClient.setQueryData(["latestMessage", selectedId], newMsg);
    });

    // Listen for reactions updates
    socket.on("reactionUpdated", (updateReaction:PrivateChatMessage) => {
      queryClient.setQueryData(["messages", selectedId], (oldData: any) => {
        return updateReactionSubscribeSocketCache(oldData, updateReaction);
      });
    });

    // Listen for deleted messages
    socket.on("messageDeleted", (messageId: string) => {
      queryClient.setQueryData(["messages", selectedId], (oldData: any) => {
        return updateDeleteMessageCache(oldData, messageId);
      });
    });

    socket.on("messageImagesUpdated", (updatedMessage: PrivateChatMessage) => {
      const isImage = updatedMessage?.images?.length > 0;
      const filesOrImages = isImage ? updatedMessage.images : updatedMessage.files;
      const type = isImage ? "image" : "document";
    
      queryClient.setQueryData(["messages", selectedId], (old: any) => {
        return UpdateNewImagesCache(old, updatedMessage._id, filesOrImages, type);
      });
    });
    
    
    

    // Listen for user read
    socket.on("messageRead", (updateUsersRead: PrivateChatMessage) => {
      queryClient.setQueryData(["messages", selectedId], (oldData: any) => {
        return updateUsersReadSubscribeSocketCache(oldData, updateUsersRead);
      });
    });
  },

  unsubscribeMessages: () => {
    const socket = authStore.getState().socket;
    if (socket && socket.connected) {
      // socket.off("newMessage");
      // socket.off("messageDeleted");
      // socket.off("newMessageRoom");
      // socket.off("reactionUpdated");
      // socket.off("messageImagesUpdated");
      // socket.off("userRead");
    }
  },
}));
