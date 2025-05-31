import { View, Text, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { authStore } from '@/stores/authStore'
import { User } from '@/types'

type UsersItemProps = {
  user: User;
  handleAddFriend: (userId: string) => void;
  addingFriendId: string | null;
  isPending: boolean;
}

const UsersItem = ({user,handleAddFriend,addingFriendId,isPending}: UsersItemProps) => {
  const { onlineUsers } = authStore();
  const isThisFriendLoading = addingFriendId === user._id;
  return (
    <TouchableOpacity
      key={user._id}
      className="flex-row items-center p-4 border-b border-gray-100 bg-white active:bg-gray-50"
      activeOpacity={0.8}
    >
      {/* Avatar and info */}
      <View className="relative mr-3">
        <Image  source={user?.picture ? { uri: user?.picture } : require("@/assets/images/unknown-person.jpg")} className="w-14 h-14 rounded-full border-2 border-white" />
        {onlineUsers?.includes(user?._id) && (
          <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
        )}
      </View>
      <View className="flex-1">
        <Text className="text-lg font-PoppinsBold text-gray-800">{user?.username}</Text>
      </View>
      {isThisFriendLoading && isPending ? (
        <ActivityIndicator size="small" color="#6366f1" />
      ) : (
        <TouchableOpacity 
          onPress={() => handleAddFriend(user._id)} 
          className="bg-indigo-50 p-3 rounded-full"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="person-add" size={20} color="#6366f1" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )
}

export default UsersItem