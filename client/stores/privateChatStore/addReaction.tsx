import { queryClient } from "@/app/_layout";
import { authStore } from "../authStore";
import { updateReactionsCache } from "@/utils/updateCacheLogic";





export const addReaction : (get: any, messageId: string, userId: string, emoji: string) => void = (get, messageId, userId, emoji)=>{
    const socket = authStore.getState().socket;
    const selectedId = get().selectedUserId;

    // Get all cached keys for this conversation
   
      queryClient.setQueryData(["messages", selectedId], (oldData: any) => {
      return  updateReactionsCache(oldData, messageId, userId, emoji)
      });

    // Emit reaction to server
    if (socket && socket.connected) {
      socket.emit("addReaction", { messageId, userId, emoji });
    }
}