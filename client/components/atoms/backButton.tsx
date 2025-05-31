import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { chatUiStore } from '@/stores/chatUiStaore'

const BackButton = () => {
    const router = useRouter()
    const {clearFiles,setSearch} = chatUiStore()
  return (
    <TouchableOpacity
    className="p-2 rounded-full bg-gray-100"
    onPress={() =>{
      router.back();
      clearFiles();
      setSearch('');
    }}
  >
    <AntDesign name="arrowleft" size={22} color="#1F2937" />
  </TouchableOpacity>
  )
}

export default BackButton