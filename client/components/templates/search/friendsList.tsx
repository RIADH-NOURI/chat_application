import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import FriendsList from '../main/lists/friendsList'
import UseUserRoomFriendData from '@/hooks/useUserRoomFriendData'

const friendsList = () => {
  const { userFriendsList, isLoadingFriends, onLoadFriends } = UseUserRoomFriendData(5);
  console.log("userFriendsList", userFriendsList);

  return (
    <>
     <View className="mb-6 px-4 mt-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Ionicons name="people" size={20} color="#6366f1" />
              <Text className="text-xl font-PoppinsBold text-gray-800 ml-2">Friends</Text>
            </View>
            <View className="bg-indigo-100 px-2 py-1 rounded-full">
              <Text className="text-xs font-PoppinsMedium text-indigo-800">
                {userFriendsList.length} {userFriendsList.length === 1 ? 'friend' : 'friends'}
              </Text>
            </View>
          </View>
          <FriendsList 
            friends={userFriendsList} 
            isLoading={isLoadingFriends} 
            onLoad={onLoadFriends}
            searchScreen={true}
          />
        </View>
     
    </>
  )
}

export default friendsList