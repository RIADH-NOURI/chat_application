import { View, Text } from 'react-native'
import React from 'react'
import AllRooms from '../main/lists/allRooms'
import { Ionicons } from '@expo/vector-icons'
import UseUserRoomFriendData from '@/hooks/useUserRoomFriendData'

const DiscoverRoomsList = () => {
        const { roomsList, isLoadingRooms, onLoadRooms} = UseUserRoomFriendData(5);
  return (
    <>
       {/* Other Rooms */}
       <View className="mb-6 px-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Ionicons name="compass" size={20} color="#6366f1" />
              <Text className="text-xl font-PoppinsBold text-gray-800 ml-2">Discover Rooms</Text>
            </View>
            <View className="bg-indigo-100 px-2 py-1 rounded-full">
              <Text className="text-xs font-PoppinsMedium text-indigo-800">
                {roomsList.length} {roomsList.length === 1 ? 'room' : 'rooms'}
              </Text>
            </View>
          </View>
          <AllRooms
            rooms={roomsList} 
            isLoading={isLoadingRooms} 
            onLoad={onLoadRooms}
            searchScreen={true}
          />
        </View>
    </>
  )
}

export default DiscoverRoomsList