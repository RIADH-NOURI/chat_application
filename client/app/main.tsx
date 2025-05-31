// =======================
// Imports
// =======================
import { View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import HeaderSection from "@/components/templates/main/headerSection";
import TabBar from "@/components/templates/main/tabBar";
import Friends from "@/components/templates/main/lists/friendsList";
import RoomsUser from "@/components/templates/main/lists/userRooms";
import Users from "@/components/templates/main/lists/usersList";
import Rooms from "@/components/templates/main/lists/allRooms";
import { authStore } from "@/stores/authStore";
import { usersStore } from "@/stores/usersStore";
import UseUserRoomFriendData from "@/hooks/useUserRoomFriendData";
import { UseAddFriend, UseAddUserInTheRoom } from "@/lib/queries";
import Toast from "react-native-toast-message";
import { Users as UsersType, Rooms as RoomsType, UserFriends } from "@/types";

// =======================
// Component Definition
// =======================
const Main = () => {
  // =======================
  // States
  // =======================
  const [activeTab, setActiveTab] = useState("Friends");
  const [addingFriendId, setAddingFriendId] = useState<string | null>(null);

  // =======================
  // Stores
  // =======================
  const { getAuthUserId, authUserInfo } = usersStore();
  const { authUser, socketConnect, disconnectSocket } = authStore();

  // =======================
  // Data Fetching
  // =======================
  const { mutate: addUserInTheRoom } = UseAddUserInTheRoom();
  const { mutate: addFriendMutation, isPending } = UseAddFriend();
  const {
    userFriendsList,
    userRoomsList,
    usersList,
    roomsList,
    isLoadingFriends,
    isLoadingUserRooms,
    isLoadingRooms,
    isLoadingUsers,
    onLoadFriends,
    onLoadUserRooms,
    onLoadRooms,
    onLoadUsers,
    refetchUserFriends,
    setUsersList,
    setUserFriendsList,
    setRoomsList,
    setUserRoomsList,
  } = UseUserRoomFriendData(10);

  // =======================
  // Effects
  // =======================
  useEffect(() => {
    if (authUser?._id) {
      getAuthUserId(authUser._id);
    }
  }, [authUser]);

  useEffect(() => {
    socketConnect();
    return () => {
      disconnectSocket();
    };
  }, [authUser]);

  // =======================
  // Event Handlers
  // =======================
  const handleAddFriend = (friendId: string) => {
    setAddingFriendId(friendId);

    addFriendMutation(
      { friendId },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Friend added successfully",
            text2: "You can now chat with them 👋",
            position: "top",
          });

          setUsersList((prevUsers: UsersType[]) =>
            prevUsers.filter((user: User) => user._id !== friendId)
          );

          setUserFriendsList((prevFriends: UserFriends[]) => {
            if (!prevFriends.some((friend: User) => friend._id === friendId)) {
              const newFriend = usersList.find((user) => user._id === friendId);
              if (newFriend) {
                return [...prevFriends, newFriend];
              }
            }
            return prevFriends;
          });

          console.log("friend added", friendId);
        },
        onError: (error) => {
          console.error("Failed to add friend:", error);
          Toast.show({
            type: "error",
            text1: "Failed to add friend",
            text2: "Please try again later",
            position: "top",
          });
        },
      }
    );
  };

  const handleAddUserInTheRoom = (roomId: string) => {
    addUserInTheRoom({ userId: authUser?._id, roomId });
    Toast.show({
      type: "success",
      text1: "User added in the room successfully",
      position: "top",
    });
    try {
      // Remove the added room from roomsList
      setRoomsList((prevRooms) =>
        prevRooms.filter((room) => room._id !== roomId)
      );
      // Only add to userRoomsList if not already present
      setUserRoomsList((prevUserRooms) => {
        if (!prevUserRooms.some((room) => room._id === roomId)) {
          const newRoom = roomsList.find((room) => room._id === roomId);
          if (newRoom) {
            return [...prevUserRooms, newRoom];
          }
        }
        return prevUserRooms;
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =======================
  // UI Rendering
  // =======================
  const renderContent = () => {
    switch (activeTab) {
      case "Friends":
        return (
          <Friends
            friends={userFriendsList}
            isLoading={isLoadingFriends}
            onLoad={onLoadFriends}
          />
        );
      case "MyRooms":
        return (
          <RoomsUser
            userRooms={userRoomsList}
            isLoading={isLoadingUserRooms}
            onLoad={onLoadUserRooms}
          />
        );
      case "Users":
        return (
          <Users
            users={usersList}
            handleAddFriend={handleAddFriend}
            isLoading={isLoadingUsers}
            addingFriendId={addingFriendId}
            isPending={isPending}
            onLoad={onLoadUsers}
          />
        );
      case "Rooms":
        return (
          <Rooms
            rooms={roomsList}
            isLoading={isLoadingRooms}
            onLoad={onLoadRooms}
            handleAddUserInTheRoom={handleAddUserInTheRoom}
          />
        );
      default:
        return <Text className="text-center my-4">No tab selected</Text>;
    }
  };

  return (
    <View className="flex-1 min-h-screen bg-white relative z-30">
      {authUserInfo ? (
        <HeaderSection
          username={authUserInfo?.username}
          refresh={refetchUserFriends}
        />
      ) : (
        <Text className="text-center my-4">Loading user info...</Text>
      )}

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {authUser?._id && renderContent()}
    </View>
  );
};

export default Main;