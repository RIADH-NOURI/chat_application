import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';

interface tabBarProps {
  activeTab : string
  setActiveTab : (tab :string) => void
}

const TabBar = ({activeTab,setActiveTab}:tabBarProps) => {
  const tabs = ['Friends', 'MyRooms',"Users","Rooms"];
 

  return (
    <View className="w-full p-4">
      <View className="flex-row gap-3 justify-center items-center max-w-full">
        <View className='rounded-full flex-row justify-center items-center bg-gray-100 border border-gray-200'>
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            className={`px-6 py-4 rounded-[50px] ${activeTab === tab ? 'bg-primary' : ''}`} 
            onPress={() => {
              setActiveTab(tab);
            }}
          >
            <Text className={`text-md font-PoppinsRegular  ${activeTab === tab ? 'text-white' : 'text-gray-500'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        </View>
       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    tabButton :{
        borderRadius : "20px",
        padding : 10,
    }
})

export default TabBar;
