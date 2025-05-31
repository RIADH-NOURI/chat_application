import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { authStore } from "@/stores/authStore";
import { useRouter } from "expo-router";
import { privateChatStore } from "@/stores/privateChatStore";
import {  UseLatestMessage } from "@/lib/queries";
import { chatUiStore } from "@/stores/chatUiStaore";
import { FormatTime } from "@/utils/formatTime";
import { User,PrivateChatMessage } from "@/types";

type FriendsItemProps = {
  friend: User;
};
const FriendsItem : React.FC<FriendsItemProps>= ({ friend }: { friend: any }) => {
  const { onlineUsers, authUser } = authStore();
  const { setSelectedUserId } = privateChatStore();
  const { setScrollOnNextUpdate } = chatUiStore();
  const { data: latestMessage, isLoading: isLoadingLatestMessage }: { data?: PrivateChatMessage; isLoading: boolean } =
    UseLatestMessage(friend._id);
  const router = useRouter();
  


  const checkIsRead =
    latestMessage?.receiverId?._id === authUser?._id && !latestMessage?.isRead;

  //console.log("checkIsRead",checkIsRead);

  return (
    <TouchableOpacity
      key={friend._id}
      onPress={() => {
        router.push(`/chat/${friend._id}`);
        setSelectedUserId(friend._id);
        setScrollOnNextUpdate(true);
      }}
      className="flex-row items-center p-4 border-b border-gray-100 bg-white active:bg-gray-50"
      activeOpacity={0.8}
    >
      {/* Avatar with online status */}
      <View className="relative mr-3">
        <Image
          source={friend?.picture ? { uri: friend?.picture } : require("@/assets/images/unknown-person.jpg")}
          className="w-14 h-14 rounded-full border-2 border-white"
          resizeMode="cover"
        />
        {onlineUsers?.includes(friend?._id) && (
          <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></View>
        )}
      </View>

      {/* User info */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-lg font-PoppinsBold text-gray-800">
            {friend?.username}
          </Text>
          <Text className="text-xs text-gray-400">
            {latestMessage?.createdAt
              ? FormatTime(latestMessage?.createdAt)
              : ""}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            className={`text-sm truncate max-w-[80%] ${
              checkIsRead
                ? "text-black font-PoppinsBold"
                : "text-gray-500 font-PoppinsRegular"
            }`}
          >
            {latestMessage?.images?.length > 0
              ? "Sent a photo"
              : latestMessage?.files?.length > 0
              ? "Sent a file"
              : latestMessage?.text}
          </Text>
          {checkIsRead && (
            <View className="bg-blue-500 w-5 h-5 rounded-full flex items-center justify-center">
              <Text className="text-xs text-white">1</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FriendsItem;
