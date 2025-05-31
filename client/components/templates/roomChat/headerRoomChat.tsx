// components/HeaderSection.tsx

import { View, Text, Image } from "react-native";
import React from "react";
import { authStore } from "@/stores/authStore";
import HeaderSectionLayout from "@/components/layout/headerSection";
import {Room} from "@/types";

const HeaderSection = ({ roomData }: { roomData: Room[] }) => {
  const { onlineUsers } = authStore();

  return (
    <HeaderSectionLayout>
      <View className="flex-row items-center gap-3">
        {roomData?.length > 0 &&
          roomData.map((data) => (
            <View
              key={data?._id}
              className="flex-row items-center gap-3"
            >
             <View className="relative">
  {/* Online Indicator */}
  {onlineUsers?.includes(data?.users[0]?._id) && (
    <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white z-10" />
  )}

  {/* Main Image */}
  <Image
    source={data?.users[1]?.picture ? { uri: data.users[1].picture } : require("../../../assets/images/unknown-person.jpg")}
    className="w-14 h-14 rounded-full border-2 border-gray-300"
    resizeMode="cover"
  />

  {/* Crescent Overlay Image */}
  <View className="absolute -top-1 -right-1 w-9 h-9 bg-white rounded-full items-center justify-center z-10">
    <Image
      source={data?.users[2]?.picture ? {uri: data.users[2].picture} : data?.users[0]?.picture ? { uri: data.users[0].picture } : require("../../../assets/images/unknown-person.jpg")}
      className="w-7 h-7 rounded-full border border-white"
      resizeMode="cover"
    />
  </View>
</View>


              {/* User Info */}
              <View className="max-w-[160px]">
                <Text className="text-base font-semibold text-gray-900">
                  {data?.users?.length >= 2
                    ? data.users
                        .slice(0, 3)
                        .map((user) => user.username)
                        .join(", ") + ", ..."
                    : data?.room?.users
                        ?.map((user) => user.username)
                        .join(", ")}
                </Text>
                <Text className="text-sm text-gray-500">
                  {data?.name}
                </Text>
              </View>
            </View>
          ))}
      </View>
    </HeaderSectionLayout>
  );
};

export default HeaderSection;
