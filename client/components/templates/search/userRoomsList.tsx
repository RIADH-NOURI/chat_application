import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import UserRoomsListData from '../main/lists/userRooms'
import UseUserRoomFriendData from '@/hooks/useUserRoomFriendData'

const UserRoomsList = () => {
  const { userRoomsList, isLoadingUserRooms, onLoadUserRooms } = UseUserRoomFriendData(5);
  return (
    <>
     <View className="mb-6 px-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Ionicons name="chatbubbles" size={20} color="#6366f1" />
              <Text className="text-xl font-PoppinsBold text-gray-800 ml-2">My Rooms</Text>
            </View>
            <View className="bg-indigo-100 px-2 py-1 rounded-full">
              <Text className="text-xs font-PoppinsMedium text-indigo-800">
                {userRoomsList.length} {userRoomsList.length === 1 ? 'room' : 'rooms'}
              </Text>
            </View>
          </View>
          <UserRoomsListData
            userRooms={userRoomsList} 
            isLoading={isLoadingUserRooms} 
            onLoad={onLoadUserRooms}
            searchScreen={true}
          />
        </View>
 
    </>
  )
}

export default UserRoomsList