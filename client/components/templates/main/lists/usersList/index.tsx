import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native'
import React from 'react'
import UsersItem from './usersItem'
import { Users } from '@/types'

// Define the props for the UsersList component
type UsersListProps = {
  isLoading: boolean;
  users: Users[];
  onLoad: () => void;
  handleAddFriend: (userId: string) => void;
  isPending: boolean;
  addingFriendId: string | null;
  searchScreen?: boolean;
};

const UsersList = ({isLoading,users,onLoad,handleAddFriend,isPending,addingFriendId,searchScreen= false}: UsersListProps) => {
    const renderItem = ({ item: user }: { item: any }) => (
        <UsersItem user={user} handleAddFriend={handleAddFriend} isPending={isPending} addingFriendId={addingFriendId} />
      );
  return (
    <FlatList
    data={users}
    renderItem={renderItem}
    keyExtractor={(item: any) => item._id.toString()}
    onEndReached={() => {
      onLoad();
    }}
    onEndReachedThreshold={0.1}
    extraData={users}
    ListFooterComponent={
       isLoading ? <ActivityIndicator size="large" /> : null
    }

    showsVerticalScrollIndicator={false}
    ListEmptyComponent={
      searchScreen ? null :  <View className="flex-1 items-center justify-center mt-10">
        <Image source={require('@/assets/images/notdata.png')} className="w-48 h-48" />
        <Text className="text-black font-PoppinsBold text-2xl">No users found</Text>
      </View>
    }
  />
  )
}

export default UsersList