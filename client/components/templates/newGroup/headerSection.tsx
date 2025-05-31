import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import { useRouter } from 'expo-router'


const HeaderSection = () => {
    const router = useRouter()
  
  return (
    <View className='container flex-row items-center justify-between px-4 py-2 bg-white shadow-black shadow-md'>
        <View className='left-container flex-row gap-4 items-center'>
        <TouchableOpacity className='' onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <View className='flex-col'>
            <Text className='font-PoppinsRegula text-xl'>New Group</Text>
            <Text className='font-PoppinsRegular text-sm text-gray-500'>Add members</Text>
        </View>
        </View>
        <View className='right-container'>
        <TouchableOpacity className="p-1">
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
        </View>
    </View>
  )
}

export default HeaderSection