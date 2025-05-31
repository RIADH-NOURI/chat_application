import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import SearchBar from '@/components/moleculles/searchBar'

import UseUserRoomFriendData from '@/hooks/useUserRoomFriendData';

import { chatUiStore } from '@/stores/chatUiStaore';
import FriendsList from '@/components/templates/search/friendsList';
import OtherUsersList from '@/components/templates/search/otherUsersList';
import UserRoomsList from '@/components/templates/search/userRoomsList';
import DiscoverRoomsList from '@/components/templates/search/discoverRoomsList';
import BackButton from '@/components/atoms/backButton';
import { useDebounce } from 'use-debounce'; // Install this library if not already installed



const Search = () => {
  const { search } = chatUiStore();
  console.log("Search component rendered with search:", search);
  
  const [debouncedSearch] = useDebounce(search, 300); 

   const{
    refetchUserFriends,
    refetchUserRooms,
    refetchUsers,
    refetchRooms,
    setPages,
    setUserFriendsList,
    setUserRoomsList,
    setUsersList,
    setRoomsList,
  } = UseUserRoomFriendData(5);
  useEffect(() => {
    if (search && search.length > 0) {
      // Reset all pages to 1
      setPages({ friends: 1, roomsUser: 1, users: 1, rooms: 1 });
      
      // Clear all lists
      setUserFriendsList([]);
      setUserRoomsList([]);
      setUsersList([]);
      setRoomsList([]);
      
      // Refetch all data with new search term
      Promise.all([
        refetchUserFriends(),
        refetchUserRooms(),
        refetchUsers(),
        refetchRooms()
      ]).catch(error => {
        console.error('Error refetching data:', error);
      });
    }
  }, [debouncedSearch]); // Use debouncedSearch instead of search
  

 

  return (
    <View className="flex-1 bg-white">
      {/* Top SearchBar */}
      <View className="p-4 bg-white border-b border-gray-200 flex-row items-center gap-2">
        <BackButton />
        <View className="flex-1">
          <SearchBar />
        </View>
      </View>

      {/* Main ScrollView */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Friends */}
       <FriendsList />

        {/* Other Users */}
       <OtherUsersList />

        {/* My Rooms */}
        
        <UserRoomsList />

        {/* Other Rooms */}
        
        <DiscoverRoomsList />
      </ScrollView>
    </View>
  )
}

export default Search