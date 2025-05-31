import mongoose from "mongoose";
import { privateChatStore } from ".";
import { authStore } from "../authStore";
import { usersStore } from "../usersStore";
import { queryClient } from "@/app/_layout";
import { UpdateNewImagesCache, updateNewMessageCache } from "@/utils/updateCacheLogic";
import { uploadImagesToServer } from "@/utils/uploadFilesToServer";
import { chatUiStore } from "../chatUiStaore";
import { PrivateChatMessage } from "@/types";

const { ObjectId } = mongoose.Types;



export const sendMessage = async (
  set: (state: { isLoading: boolean }) => void,
  text: string,
  receiverId: string,
  receiverName: string,
  files: string[],
) => {
  
  const socket = authStore.getState().socket;
  const senderId = authStore.getState().authUser?.id;
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
    reactions: [],
    text,
    images: [],
    createdAt: new Date().toISOString(),
  };

  try {
    queryClient.setQueryData(["messages", selectedUserId], (oldData: Message[] = []) =>
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

          queryClient.setQueryData(["messages", selectedUserId], (oldData: Message[] = []) =>
            UpdateNewImagesCache(oldData, newMessageId, uploadedImageUrls,typeFile)
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
};
