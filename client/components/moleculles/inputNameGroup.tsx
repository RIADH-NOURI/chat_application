import { View, Text, TextInput } from 'react-native'
import React from 'react'

const InputNameGroup = ({ roomName, setRoomName }) => {
  return (
    <>
     
      <View className="mx-6 mb-4">
        <TextInput
          placeholder="Enter group name"
          value={roomName}
          onChangeText={setRoomName}
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 bg-gray-50 font-PoppinsRegular"
        />
      </View>
    </>
  )
}

export default InputNameGroup