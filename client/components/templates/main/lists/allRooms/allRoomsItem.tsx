import { View, Text, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { authStore } from '@/stores/authStore'
import { useRouter } from 'expo-router'
import { roomChatStore } from '@/stores/roomChatStore'
import { Rooms } from '@/types'

type AllRoomsProps = {
  room: Rooms
  handleAddUserInTheRoom: () => void
}



const allRooms:React.FC<AllRoomsProps> = ({room,handleAddUserInTheRoom}) => {
 
  return (
    <>
            <TouchableOpacity
           
            className="flex-row gap-7 items-center p-4 border-b border-gray-100 bg-white active:bg-gray-50"
            activeOpacity={0.8}
          >
            {/* Avatar and info */}
            <View className="relative mr-3">
            <Image
    source={room?.users[1]?.picture ? { uri: room?.users[1]?.picture } : require("@/assets/images/unknown-person.jpg")}
    className="w-14 h-14 rounded-full border-2 border-gray-300"
    resizeMode="cover"
  />

  {/* Crescent Overlay Image */}
  <View className="absolute -top-2 -right-4 w-9 h-9 bg-white rounded-full items-center justify-center z-10">
    <Image
      source={
        room?.users[2]?.picture ? { uri: room?.users[2]?.picture } : require("@/assets/images/unknown-person.jpg")
      }
      className="w-14 h-14 rounded-full border border-white"
      resizeMode="cover"
    />
  </View>
             {/*{onlineUsers?.includes(userRoom.users[0]?._id) && (
             {/*   <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
             {/* )}   */}
             
             </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-lg font-PoppinsBold text-gray-800">{room?.name}</Text>
                <TouchableOpacity 
          onPress={() => handleAddUserInTheRoom(room._id)} 
          className="bg-indigo-50 p-3 rounded-full"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="person-add" size={20} color="#6366f1" />
        </TouchableOpacity>
              </View>
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center space-x-2">
                
                </View>
              </View>
            </View>
          </TouchableOpacity>
    
    </>
  )
}

export default allRooms