import { View, Text, ActivityIndicator, Image } from 'react-native'
import React from 'react'
import AllRoomsItem from './allRoomsItem'
import { FlatList } from 'react-native'
import  {Rooms} from '@/types'
type AllRoomsProps = {
  rooms: Rooms;
  isLoading: boolean;
  onLoad: () => void;
  handleAddUserInTheRoom: () => void;
  searchScreen?: boolean;
};

const AllRooms : React.FC<AllRoomsProps> = ({rooms,isLoading,onLoad,searchScreen= false,handleAddUserInTheRoom}) => {
    const renderItem = ({item}:{item:any}) => {
        return <AllRoomsItem room={item} handleAddUserInTheRoom={handleAddUserInTheRoom} />
    }
  return (
    <FlatList
        data={rooms}
        renderItem={renderItem}
        keyExtractor={(item)=>item._id}
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

export default AllRooms