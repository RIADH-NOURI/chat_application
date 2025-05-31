import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { ReactNode } from "react";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { chatUiStore } from "@/stores/chatUiStaore";

type FooterSectionProps = {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleShowUploadForm: () => void;
};

const FooterSection = ({
  message,
  setMessage,
  handleSendMessage,
  handleShowUploadForm,
}: FooterSectionProps) => {
  const {files} = chatUiStore()
  const isSendDisabled = message.trim() === "" && (!files || files.length === 0);

  
  

  return (
    <View className="absolute bottom-0 w-full p-2  border-t border-gray-200 z-30 bg-white">
      <View className="flex-row items-center gap-3 ">
        <TouchableOpacity>
          <MaterialIcons name="keyboard-voice" size={22} color="#555" />
        </TouchableOpacity>

        <TextInput
          className="flex-1 bg-gray-100 px-4 py-2 rounded-full text-base text-black"
          placeholder="Type a message"
          placeholderTextColor="#aaa"
          value={message}
          onChangeText={setMessage}
          multiline={true}
       textAlignVertical="top"

        />

        <TouchableOpacity onPress={handleShowUploadForm}>
          <AntDesign name="paperclip" size={22} color="#555" />
        </TouchableOpacity>
        <View className="items-end mt-2">
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={isSendDisabled}
            className="p-2 rounded-full"
          >
            <Feather
              name="send"
              size={24}
              color={ isSendDisabled? "#ccc" : "#007bff"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FooterSection;
