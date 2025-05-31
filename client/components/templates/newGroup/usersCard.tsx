import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { authStore } from '@/stores/authStore'
import { FontAwesome } from '@expo/vector-icons'
import { User,Users } from '@/types'

type UsersCardProps = {
  users: Users[]
  selectedUsers: string[]
  setSelectedUsers: (users: string[]) => void
  handleLoadMore: () => void
  isLoadingAllUsers: boolean
}

const UsersCard = ({
  users,
  selectedUsers,
  setSelectedUsers,
  handleLoadMore,
  isLoadingAllUsers,
}: UsersCardProps) => {
  const router = useRouter()
  const { authUser, onlineUsers } = authStore()

  const handleSelectUserId = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      if (selectedUsers.length === 0) {
        setSelectedUsers([userId, authUser?._id])
      } else {
        setSelectedUsers([...selectedUsers, userId])
      }
    }
  }

  const renderItem = ({ item: user }: { item: User }) => {
    const isSelected = selectedUsers.includes(user._id)

    return (
      <TouchableOpacity
        key={user._id}
        onPress={() => handleSelectUserId(user._id)}
        activeOpacity={0.7}
        className={`flex-row items-center px-4 py-3 bg-white ${
          isSelected ? 'bg-gray-100' : ''
        }`}
      >
        {/* Avatar */}
        <View className="relative mr-4">
          <Image
            source={user?.picture ? { uri: user?.picture } : require("@/assets/images/unknown-person.jpg")}
            className="w-14 h-14 rounded-full"
            resizeMode="cover"
          />
          {/* Online dot */}
          {onlineUsers?.includes(user?._id) && (
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </View>

        {/* User info */}
        <View className="flex-1 border-b border-gray-100 pb-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-PoppinsBold text-gray-900 max-w-[70%]" numberOfLines={1}>
              {user?.username}
            </Text>
            {isSelected && (
              <FontAwesome
                name="check-circle"
                size={20}
                color="green"
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
          <Text className="text-sm font-PoppinsRegular text-gray-500 mt-1" numberOfLines={1}>
            Last message preview goes here...
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.2}
      ListFooterComponent={
        isLoadingAllUsers ? (
          <ActivityIndicator size="large" color="#2563eb" />
        ) : null
      }
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center mt-12">
          <Image
            source={require('../../../assets/images/notdata.png')}
            className="w-48 h-48"
            resizeMode="contain"
          />
          <Text className="text-black font-PoppinsBold text-xl mt-4">
            No conversations yet
          </Text>
        </View>
      }
      contentContainerStyle={{
        paddingTop: 8,
        paddingBottom: 50,
      }}
    />
  )
}

export default UsersCard
