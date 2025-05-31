import { View, Text, Animated, TouchableOpacity } from 'react-native'
import React from 'react'
import { menuItems } from '@/constants'
import Feather from '@expo/vector-icons/Feather'
import { authStore } from '@/stores/authStore'
import { useRouter } from 'expo-router'

const ListMenu = ({menuVisible,toggleMenu,fadeAnim}) => {
  const {logout} = authStore()
  const router = useRouter()
  return (
    <>
     {/* Dropdown Menu */}
            {menuVisible && (
              <Animated.View 
                className="absolute right-0 top-14 bg-white rounded-lg py-2 w-44 shadow-lg shadow-black z-50"
                style={{
                  opacity: fadeAnim,
                  transform: [{ scale: fadeAnim }]
                }}
              >
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="flex-row items-center py-2.5 px-4"
                    onPress={() => {
                      if(item.name === "Logout"){
                        logout()
                      }
                      if (item.name === "New Group"){
                        router.push("/newGroup")
                      }
                      if (item.name === "Settings") {
                        router.push("/settings")
                      }
                      toggleMenu();
                      // Handle menu item press here
                    }}
                  >
                    <Feather name={item.icon} size={18} color="#4B5563" className="mr-3" />
                    <Text className="text-base text-gray-800 font-PoppinsRegular">{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
    </>
  )
}

export default ListMenu