import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const ReactionList = ({handleAddReaction}) => {
  const emojies = ["❤️", "😂", "😮", "😢", "😡", "👍"];

  return (
    <View className="flex flex-row gap-2 items-center bg-white w-auto p-4 rounded-[50px]">
      {emojies.map((emoji, index) => (
        <TouchableOpacity  key={index} onPress={() => {console.log("emoji",emoji);
          handleAddReaction(emoji)
        }}>
          <Text className="text-3xl">{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ReactionList;
