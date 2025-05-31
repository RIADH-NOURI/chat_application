import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { chatUiStore } from '@/stores/chatUiStaore';

const SearchBar = () => {
  const {search,setSearch} = chatUiStore();
  return (
    <View className="flex-row items-center bg-gray-100 rounded-full px-4 h-14 w-full">
    <Ionicons name="search" size={20} color="#666" className="mr-2" />
    <TextInput
      className="flex-1 text-base text-gray-800 py-2"
      value={search}
      placeholder="Search..."
      placeholderTextColor="#666"
      keyboardType="default"
      onChangeText={(text)=>setSearch(text)}
    />
  </View>
  )
}

export default SearchBar