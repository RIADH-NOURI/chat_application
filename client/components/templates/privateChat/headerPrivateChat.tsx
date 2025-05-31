import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authStore } from '@/stores/authStore';
import { useRouter } from 'expo-router';
import HeaderSectionLayout from '@/components/layout/headerSection';
import { User } from '@/types';



interface HeaderSectionProps {
  user: User;
  isLoading?: boolean;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ user, isLoading = false }) => {
  const { onlineUsers } = authStore();
  
  
  return (
    <HeaderSectionLayout>
      <View className='left-container flex-row gap-4 items-center'>
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <View key={user?._id} className='flex-row gap-4 items-center'>
            <View className='picture-conatiner rounded-full relative'>
              {/*check is online user*/}
              {onlineUsers?.includes(user?._id) && (
                <View className='absolute bottom-0.5 right-0 w-3 h-3 rounded-full bg-green-500 z-10'></View>
              )}
              <Image 
                resizeMode='cover'  
                source={user?.picture ? {uri:user.picture} : require("@/assets/images/unknown-person.jpg")} 
                className="w-12 h-12 rounded-full border"
              />
            </View>
            <View className='user-info flex-col'>
              <Text className='text-base font-semibold text-gray-900'>{user?.username}</Text>
              <Text className='text-sm text-gray-500'>
                {onlineUsers?.includes(user?._id) ? "online" : "offline"}
              </Text>
            </View>
          </View>
        )}
      </View>
    </HeaderSectionLayout>
  );
};

export default HeaderSection;