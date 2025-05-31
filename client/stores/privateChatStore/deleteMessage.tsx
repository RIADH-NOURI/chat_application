import { updateDeleteMessageCache } from "@/utils/updateCacheLogic";
import { authStore } from "../authStore";
import { queryClient } from "@/app/_layout";




export const deleteMessage: (get: any, set: any, messageId: string, userId: string) => void = ( get, set, messageId, userId)=>{
    const selectedId = get().selectedUserId;
    const socket = authStore.getState().socket;

    if (socket && socket.connected) {
      set({ isLoading: true });
      socket.emit("deleteMessage", { messageId, userId });
      set({ isLoading: false });
    }

    queryClient.setQueryData(["messages", selectedId], (oldData: any) => {
      return updateDeleteMessageCache(oldData, messageId)
    });
}