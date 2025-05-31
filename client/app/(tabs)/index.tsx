import { View, Text, ScrollView, Button } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
import { authStore } from '@/stores/authStore'

const index = () => {
  const {logout}=authStore()
  return (
    <ScrollView>
      <Redirect href="/settings" />
    <View>
      <Text>index</Text>
      <Button title='Logout' onPress={logout} className='bg-red-500'>logout</Button>
    </View>
    </ScrollView>
  )
}

export default index