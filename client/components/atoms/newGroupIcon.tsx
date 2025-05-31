import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import { ActivityIndicator } from 'react-native'
import { chatUiStore } from '@/stores/chatUiStaore'
import { roomChatStore } from '@/stores/roomChatStore'

const NewGroupIcon = ({isSelected,handleCreateRoom,isCreatingRoom}) => {
  return (
            <TouchableOpacity className={`absolute right-10 bottom-5 p-4 rounded-xl z-40 ${isSelected ? 'bg-primary' : 'bg-gray-400'}`} disabled={!isSelected} onPress={handleCreateRoom}>
                {
                  isCreatingRoom ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                  ) : (
                    <AntDesign name="arrowright" size={24} color="white" />
                  )
                }
        </TouchableOpacity>
            
  )
}

export default NewGroupIcon