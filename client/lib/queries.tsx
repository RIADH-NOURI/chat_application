import { queryClient } from "@/app/_layout";
import { privateChatStore } from "@/stores/privateChatStore";
import { roomChatStore } from "@/stores/roomChatStore";
import { usersStore } from "@/stores/usersStore";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";




//get images by message id
export const UseGetImagesByMessageId = (messageId: string) => {
  const { getImagesByMessageId } = privateChatStore();
  return useQuery({
    queryKey: ["images", messageId],
    queryFn: () => getImagesByMessageId(messageId),
    enabled: !!messageId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
//get messages
export const UseGetMessages = (messageId: string) => {
  const { getMessages } = privateChatStore();

  return useInfiniteQuery({
    queryKey: ['messages', messageId],
    queryFn: ({ pageParam = 1 }) => getMessages(messageId, pageParam),
    getNextPageParam: (lastPage) => {
      // lastPage is the full API response
      if (lastPage.hasMore) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    enabled: !!messageId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// get room messages
export const UseGetRoomMessages = (roomId: string) => {
  const { getRoomById } = roomChatStore();
  return useInfiniteQuery({
    queryKey: ['roomData', roomId],
    queryFn: ({ pageParam = 1 }) => getRoomById(roomId, pageParam),
    getNextPageParam: (lastPage) => {
      // lastPage is the full API response
      if (lastPage.hasMore) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    enabled: !!roomId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

//get user by id
export const UseUserById = (userId: string) => {
  const { getUserById } = usersStore();
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
// get latest Message
export const UseLatestMessage = (messageId: string) => {
  const { getLatestMessage } = privateChatStore();
  return useQuery({
    queryKey: ["latestMessage", messageId],
    queryFn: () => getLatestMessage(messageId),
    enabled: !!messageId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
// get latest message from room
export const UseLatestMessageFromRoom = (roomId: string) => {
  const { getLatestMessageFromRoom } = roomChatStore();
  return useQuery({
    queryKey: ["latestMessageFromRoom", roomId],
    queryFn: () => getLatestMessageFromRoom(roomId),
    enabled: !!roomId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
//get user friends
export const UseUserFriends = (
  userId: string,
  page: number,
  limit: number,
  search: string
) => {
  const { getUserFriends } = usersStore();
  return useQuery({
    queryKey: ["userFriends", userId, page, limit, search],
    queryFn: () => getUserFriends(userId, page, limit, search),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
//get room users
export const UseRoomsByUser = (
  userId: string,
  page: number,
  limit: number,
  search: string
) => {
  const { getRoomsByUser } = roomChatStore();
  return useQuery({
    queryKey: ["roomsByUser", userId, page, limit, search],
    queryFn: () => getRoomsByUser(userId, page, limit, search),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
//get all rooms
export const UseRooms = (page: number, limit: number, search: string) => {
  const { getRooms } = roomChatStore();
  return useQuery({
    queryKey: ["rooms", page, limit, search],
    queryFn: () => getRooms(page, limit, search),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
// get all users
export const UseUsers = (
  page: number,
  limit: number,
  enabled: boolean,
  search: string
) => {
  const { getUsers } = usersStore();

  return useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: () => getUsers(page, limit, search),
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// get all users
export const UseAllUsers = (page: number, limit: number, search: string) => {
  const { getAllUsers } = usersStore();
  return useQuery({
    queryKey: ["allUsers", page, limit, search],
    queryFn: () => getAllUsers(page, limit, search),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
// add friend
export const UseAddFriend = () => {
  const { addFriend } = usersStore();
  return useMutation({
    mutationFn: ({ friendId }: { friendId: string }) => addFriend(friendId),
    onSuccess: () => {
      // Invalidate all userFriends queries
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "userFriends",
      });
      // Invalidate all users queries
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "users",
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

// create and join room
export const UseCreateAndJoinRoom = () => {
  const { createAndJoinRoom } = roomChatStore();
  return useMutation({
    mutationFn: ({
      roomName,
      usersIds,
    }: {
      roomName: string;
      usersIds: string[];
    }) => createAndJoinRoom({ roomName, usersIds: usersIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
// addUsreInThe Room 
export const UseAddUserInTheRoom = () => {
   const { addUserInTheRoom } = roomChatStore();
   return useMutation({
     mutationFn: ({ userId,roomId }: { userId: string,roomId:string }) => addUserInTheRoom(userId,roomId),
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["rooms"] });
     },
     onError: (error) => {
       console.log(error);
     },
   });
 };