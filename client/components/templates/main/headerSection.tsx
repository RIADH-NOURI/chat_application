import { View, Text, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import Feather from '@expo/vector-icons/Feather';
import ListMenu from '@/components/organisms/listMenu'; // Import your ListMenu component
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderSectionProps {
  username: string;
}

const HeaderSection = ({ username }: HeaderSectionProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View className="flex-row justify-between items-center w-full px-4 py-2  relative z-10">
      {/* Left Section */}
      <View className="p-2.5">
        <Text className="text-xs text-gray-500 font-PoppinsRegular">Hello,</Text>
        <Text className="text-3xl text-black font-PoppinsBold">{username}</Text>
      </View>

      {/* Icons Section */}
      <View className="flex-row gap-2.5 p-2.5 relative">
        <TouchableOpacity className="p-1" onPress={() => router.push('/search')}>
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
    
        <TouchableOpacity 
          className="p-1"
          onPress={toggleMenu}
        >
          <Feather name="more-vertical" size={24} color="black" />
        </TouchableOpacity>

        {/* Render ListMenu component */}
        <ListMenu menuVisible={menuVisible} toggleMenu={toggleMenu} fadeAnim={fadeAnim} />
      </View>
    </View>
  );
};

export default HeaderSection;