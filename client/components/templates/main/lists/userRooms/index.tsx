import { View, Text, ActivityIndicator, Image } from 'react-native'
import React from 'react'
import UsersRoomsItem from './userRoomsItem'
import { FlatList } from 'react-native'
import { Rooms } from '@/types'
type UserRoomsProps = {
    userRooms: Rooms[];
    isLoading: boolean;
    onLoad: () => void;
    searchScreen?: boolean;
  };

const UserRooms: React.FC<UserRoomsProps> = ({userRooms,isLoading,onLoad,searchScreen= false}) => {
    const renderItem = ({item}:{item:any}) => {
        return <UsersRoomsItem userRoom={item} />
    }
  return (
    <FlatList
        data={userRooms}
        renderItem={renderItem}
        keyExtractor={(item: any)=>item._id}
        onEndReached={() => {
            onLoad();
          }}
          onEndReachedThreshold={0.1}
        ListEmptyComponent={  searchScreen ? null :  <View className="flex-1 items-center justify-center mt-10">
            <Image source={require('@/assets/images/notdata.png')} className="w-48 h-48" />
            <Text className="text-black font-PoppinsBold text-2xl">No rooms found</Text>
          </View>}
        ListFooterComponent={isLoading ? <ActivityIndicator size="large" /> : null}
    />
  )
}

export default UserRooms