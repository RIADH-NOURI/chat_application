import { View, Text,  TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { authStore } from '@/stores/authStore'
import { useRouter } from 'expo-router'
import { roomChatStore } from '@/stores/roomChatStore'
import { FormatTime } from '@/utils/formatTime'
import { UseLatestMessageFromRoom } from '@/lib/queries'
import { Room } from '@/types'

const UsersRoomsItem = ({userRoom}:{userRoom:Room}) => {
  const { onlineUsers } = authStore();
  const router = useRouter()
  const {setSelectedRoomId}= roomChatStore()
  const {data:latestMessageFromRoom,isLoading:isLoadingLatestMessage} = UseLatestMessageFromRoom(userRoom._id)


  
  return (
    <>
            <TouchableOpacity
            key={userRoom._id}
            className="flex-row gap-7 items-center p-4 border-b border-gray-100 bg-white active:bg-gray-50"
            activeOpacity={0.8}
            onPress={() => {
              setSelectedRoomId(userRoom._id)
              router.push(`/room/${userRoom._id}`)
            }}
          >
            {/* Avatar and info */}
            <View className="relative mr-3">
            <Image
    source={userRoom?.users[1]?.picture ? { uri: userRoom?.users[1]?.picture } : require("@/assets/images/unknown-person.jpg")}
    className="w-14 h-14 rounded-full border-2 border-gray-300"
    resizeMode="cover"
  />

  {/* Crescent Overlay Image */}
  <View className="absolute -top-2 -right-4 w-9 h-9 bg-white rounded-full items-center justify-center z-10">
    <Image
      source={
        userRoom?.users[2]?.picture ? { uri: userRoom?.users[2]?.picture } : require("@/assets/images/unknown-person.jpg")
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
          <Text className="text-lg font-PoppinsBold text-gray-800">
            {userRoom?.name}
          </Text>
          <Text className="text-xs text-gray-400">
            {latestMessageFromRoom?.createdAt
              ? FormatTime(latestMessageFromRoom?.createdAt)
              : ""}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            className={`text-sm truncate max-w-[80%] font-PoppinsRegular `}
          >
            {latestMessageFromRoom?.images?.length > 0
              ? "Sent a photo"
              : latestMessageFromRoom?.files?.length > 0
              ? "Sent a file"
              : latestMessageFromRoom?.text}
          </Text>
          
           
        
        </View>
      </View>
          </TouchableOpacity>
    
    </>
  )
}

export default UsersRoomsItem