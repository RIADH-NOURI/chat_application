// components/layout/HeaderSectionLayout.tsx

import { View, TouchableOpacity } from "react-native";
import React, { ReactNode } from "react";
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { chatUiStore } from "@/stores/chatUiStaore";

type HeaderSectionProps = {
  children?: ReactNode;
};

const HeaderSectionLayout = ({ children }: HeaderSectionProps) => {
  const { setReactionMessageId,clearFiles,setShowUploadForm,setShowOptions,setSelectedMessage } = chatUiStore();
  return (
    <View className="w-full flex-row items-center justify-between px-4 py-3 bg-white shadow-md">
      {/* Back Button */}
      <TouchableOpacity
        className="p-2 rounded-full bg-gray-100"
        onPress={() => {
          router.back();
          setReactionMessageId(null);
          clearFiles();
          setShowUploadForm(false);
          setShowOptions(false);
          setSelectedMessage(null);
        }}
      >
        <AntDesign name="arrowleft" size={22} color="#1F2937" />
      </TouchableOpacity>

      {/* Children (center content) */}
      <View className="flex-1 mx-4">{children}</View>

      {/* Right Icons */}
      <View className="flex-row gap-3 items-center">
        <TouchableOpacity className="p-2 rounded-full bg-gray-100">
          <FontAwesome name="phone" size={18} color="#1F2937" />
        </TouchableOpacity>
        <TouchableOpacity className="p-2 rounded-full bg-gray-100">
          <FontAwesome6 name="video" size={18} color="#1F2937" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderSectionLayout;
