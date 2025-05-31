import React from 'react';
import { View, Text, Animated } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const toastStyles = {
  container: 'absolute top-4 left-1/2 -translate-x-1/2 w-[90%] rounded-lg flex-row items-start shadow-md p-4 z-50',
  text1: 'text-red-500 text-sm font-bold mb-1',
  text2: 'text-white text-xs',
  iconWrapper: 'mr-3 mt-1',
};

const toastConfig = {
  success: ({ text1, text2 }: CustomToastProps) => (
    <Animated.View 
      className={`${toastStyles.container} bg-[#1D2939] border-l-4 border-[#32D583]`}
      entering={fadeIn}
      exiting={fadeOut}
    >
      <View className="flex-row items-start">
        <View className={toastStyles.iconWrapper}>
          <Feather name="check-circle" size={20} color="#32D583" />
        </View>
        <View>
          {text1 && <Text className={toastStyles.text1}>{text1}</Text>}
          {text2 && <Text className={toastStyles.text2}>{text2}</Text>}
        </View>
      </View>
    </Animated.View>
  ),
  error: ({ text1, text2 }: CustomToastProps) => (
    <Animated.View x
      className={`${toastStyles.container} bg-[#1D2939] border-l-4 border-[#F04438]`}
      entering={fadeIn}
      exiting={fadeOut}
    >
      <View className="flex-row items-start">
        <View className={toastStyles.iconWrapper}>
          <MaterialIcons name="error-outline" size={20} color="#F04438" />
        </View>
        <View>
          {text1 && <Text className={toastStyles.text1}>{text1}</Text>}
          {text2 && <Text className={toastStyles.text2}>{text2}</Text>}
        </View>
      </View>
    </Animated.View>
  ),
  warning: ({ text1, text2 }: CustomToastProps) => (
    <Animated.View 
      className={`${toastStyles.container} bg-[#1D2939] border-l-4 border-[#FEC84B]`}
      entering={fadeIn}
      exiting={fadeOut}
    >
      <View className="flex-row items-start">
        <View className={toastStyles.iconWrapper}>
          <MaterialIcons name="warning" size={20} color="#FEC84B" />
        </View>
        <View>
          {text1 && <Text className={toastStyles.text1}>{text1}</Text>}
          {text2 && <Text className={toastStyles.text2}>{text2}</Text>}
        </View>
      </View>
    </Animated.View>
  ),
  info: ({ text1, text2 }: CustomToastProps) => (
    <Animated.View 
      className={`${toastStyles.container} bg-[#1D2939] border-l-4 border-[#53B1FD]`}
      entering={fadeIn}
      exiting={fadeOut}
    >
      <View className="flex-row items-start">
        <View className={toastStyles.iconWrapper}>
          <Feather name="info" size={20} color="#53B1FD" />
        </View>
        <View>
          {text1 && <Text className={toastStyles.text1}>{text1}</Text>}
          {text2 && <Text className={toastStyles.text2}>{text2}</Text>}
        </View>
      </View>
    </Animated.View>
  ),
};

// Simple fade animations for toast entry/exit
const fadeIn = {
  from: { opacity: 0, translateY: -20 },
  to: { opacity: 1, translateY: 0 },
};

const fadeOut = {
  from: { opacity: 1, translateY: 0 },
  to: { opacity: 0, translateY: -20 },
};

export default toastConfig;