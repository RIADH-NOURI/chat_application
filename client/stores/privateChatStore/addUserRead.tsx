import { queryClient } from "@/app/_layout";
import { authStore } from "../authStore";
import { updateUsersReadCache } from "@/utils/updateCacheLogic";




export const addUserReadId : (get: any, userId: string, authUserId: string, socket: any, selectedId: string) => void = ( get, userId, authUserId,socket,selectedId)=>{
  
  
    queryClient.setQueryData(["messages", selectedId], (oldData: any) => {
     return updateUsersReadCache(oldData,authUserId)
    });
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "latestMessage",
    });
  
    if (socket && socket.connected) {
      socket.emit("addUserRead", { authUserId, userId });
      console.log("Emitting addReadedUserId", { userId, authUserId });
    }
}