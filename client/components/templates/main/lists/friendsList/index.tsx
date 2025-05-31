import { View, Text, ActivityIndicator, Image, FlatList } from 'react-native'
import React from 'react'
import FriendsItem from './friendsItem'

const FriendsList = ({friends,isLoading,onLoad,searchScreen= false }:{friends:any,isLoading:any,onLoad:any,searchScreen:boolean}) => {
    const renderItem = ({item}:{item:any})=>{
        return <FriendsItem friend={item} />
    }
  return (
 
    <FlatList 
    data={friends}
    renderItem={renderItem}
    keyExtractor={(item) => item._id}
    onEndReached={onLoad}
    onEndReachedThreshold={0.1}
    ListFooterComponent={
        isLoading ? <ActivityIndicator size="large" /> : null
     }
     ListEmptyComponent={
      searchScreen ? null : 
       <View className="flex-1 items-center justify-center mt-10">
      <Image source={require('@/assets/images/notdata.png')} className="w-48 h-48" />
      <Text className="text-black font-PoppinsBold text-2xl">No friends found</Text>
    </View>
     }
    />
  )
}

export default FriendsList