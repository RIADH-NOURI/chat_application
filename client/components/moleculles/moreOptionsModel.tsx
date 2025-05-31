import { View, Text, TouchableOpacity ,Module} from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { chatUiStore } from '@/stores/chatUiStaore'
const MoreOptionsModel = ({ handleCopy, handleDelete }) => {
    const {showOptions} = chatUiStore()
  return (
   <>
   <View
        className={`${
          showOptions ? "flex" : "hidden"
        } absolute bottom-0 z-50 w-full `}
      >
        {/* Then options box */}
        <View className="bg-white p-5 rounded-t-2xl w-full">
          <Text className="text-lg font-semibold mb-4 text-center">
            Message Options
          </Text>
          <View className="flex-row justify-around">
            <TouchableOpacity onPress={handleCopy} className="items-center">
              <Feather name="copy" size={24} color="#333" />
              <Text className="mt-1 text-sm">Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} className="items-center">
              <Feather name="trash-2" size={24} color="red" />
              <Text className="mt-1 text-sm text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View></> 
  )
}

export default MoreOptionsModel