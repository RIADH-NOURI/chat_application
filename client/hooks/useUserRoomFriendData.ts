import React, { useEffect, useState } from "react";
import {
  UseRooms,
  UseRoomsByUser,
  UseUserFriends,
  UseUsers,
} from "@/lib/queries";
import { authStore } from "@/stores/authStore";
import { chatUiStore } from "@/stores/chatUiStaore";
import { Rooms, Users, UserFriends } from "@/types";
import { PaginatedResponse } from "@/types"; 

const UseUserRoomFriendData = (limit: number) => {
  const { authUser } = authStore();
  const { search } = chatUiStore();
  const [pages, setPages] = useState({
    users: 1,
    friends: 1,
    rooms: 1,
    roomsUser: 1,
  });

  const [userRoomsList, setUserRoomsList] = useState<Rooms[]>([]);
  const [userFriendsList, setUserFriendsList] = useState<UserFriends[]>([]);
  const [roomsList, setRoomsList] = useState<Rooms[]>([]);
  const [usersList, setUsersList] = useState<Users[]>([]);

  const searchValue = search ?? "";

  

  const {
    data: userFriendsData,
    isLoading: isLoadingFriends,
    refetch: refetchUserFriends,
  }: {
    data?: PaginatedResponse<UserFriends>;
    isLoading: boolean;
    refetch: () => void;
  } = UseUserFriends(authUser?._id, pages.friends, limit, searchValue);

  const {
    data: userRoomsData,
    isLoading: isLoadingUserRooms,
    refetch: refetchUserRooms,
  }: {
    data?: PaginatedResponse<Rooms>;
    isLoading: boolean;
    refetch: () => void;
  } = UseRoomsByUser(authUser?._id, pages.roomsUser, limit, searchValue);

  const {
    data: roomsData,
    isLoading: isLoadingRooms,
    refetch: refetchRooms,
  }: {
    data?: PaginatedResponse<Rooms>;
    isLoading: boolean;
    refetch: () => void;
  } = UseRooms(pages.rooms, limit, searchValue);

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  }: {
    data?: PaginatedResponse<Users>;
    isLoading: boolean;
    refetch: () => void;
  } = UseUsers(pages.users, limit, true, searchValue);

  const increasePage = (key: keyof typeof pages) => {
    setPages((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  };

  const onLoadUsers = () => {
    if (!isLoadingUsers && usersData?.hasMore) increasePage("users");
  };

  const onLoadFriends = () => {
    if (!isLoadingFriends && userFriendsData?.hasMore) increasePage("friends");
  };

  const onLoadUserRooms = () => {
    if (!isLoadingUserRooms && userRoomsData?.hasMore) increasePage("roomsUser");
  };

  const onLoadRooms = () => {
    if (!isLoadingRooms && roomsData?.hasMore) increasePage("rooms");
  };

  const updateList = <T extends { _id: string }>(
    newData: PaginatedResponse<T> | undefined,
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    key: string,
    page: number
  ) => {
    if (newData?.[key]) {
      setList((prev) => {
        if (page === 1) {
          return newData[key];
        }
        const combined = [...prev, ...newData[key]];
        return [...new Map(combined.map((u) => [u._id, u])).values()];
      });
    }
  };
  
  useEffect(() => {
    if (authUser?._id) updateList(userRoomsData, setUserRoomsList, "rooms", pages.roomsUser);
  }, [userRoomsData, authUser]);
  
  useEffect(() => {
    if (authUser?._id) updateList(roomsData, setRoomsList, "rooms", pages.rooms);
  }, [roomsData, authUser]);
  
  useEffect(() => {
    if (authUser?._id) updateList(usersData, setUsersList, "users", pages.users);
  }, [usersData, authUser]);
  
  useEffect(() => {
    if (authUser?._id) updateList(userFriendsData, setUserFriendsList, "friends", pages.friends);
  }, [userFriendsData, authUser]);
  

  return {
    isLoadingFriends,
    isLoadingUserRooms,
    isLoadingRooms,
    isLoadingUsers,
    updateList,
    usersList,
    setUsersList,
    userFriendsList,
    setUserFriendsList,
    setUserRoomsList,
    roomsList,
    userRoomsList,
    onLoadUsers,
    onLoadFriends,
    onLoadUserRooms,
    onLoadRooms,
    refetchUserFriends,
    refetchUsers,
    refetchUserRooms,
    refetchRooms,
    pages,
    setPages,
    setRoomsList,
  };
};

export default UseUserRoomFriendData;
