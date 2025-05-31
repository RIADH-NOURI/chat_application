import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import UsersList from '../main/lists/usersList'
import UseUserRoomFriendData from '@/hooks/useUserRoomFriendData'

const OtherUsersList = () => {
  const { usersList, isLoadingUsers, onLoadUsers } = UseUserRoomFriendData(5);
  return (
    <>
     <View className="mb-6 px-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Ionicons name="person-add" size={20} color="#6366f1" />
              <Text className="text-xl font-PoppinsBold text-gray-800 ml-2">Other Users</Text>
            </View>
            <View className="bg-indigo-100 px-2 py-1 rounded-full">
              <Text className="text-xs font-PoppinsMedium text-indigo-800">
                {usersList.length} {usersList.length === 1 ? 'user' : 'users'}
              </Text>
            </View>
          </View>
          <UsersList
            users={usersList} 
            isLoading={isLoadingUsers} 
            onLoad={onLoadUsers}
            handleAddFriend={() => {}}
            isPending={false}
            addingFriendId=""
            searchScreen={true}
          />
        </View>

    </>
  )
}

export default OtherUsersList