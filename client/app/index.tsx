import { Image, Text, View, TouchableOpacity } from "react-native";
import { Redirect, useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    
    <View className="flex-1 bg-white p-6">
      {/* Image Section */}
      <View className="flex-1 justify-center items-center">
        <Image 
          source={require("../assets/images/Welcome-rafiki.png")} 
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>
      
      {/* Text Content Section */}
      <View className="mb-12">
        <Text className="text-4xl font-PoppinsBold text-center text-primary mb-4">
          Welcome to Chat App
        </Text>
        <Text className="text-xl text-center text-primary font-PoppinsBold mb-3">
          Connect with friends and family
        </Text>
        <Text className="text-base text-center text-gray-600 font-PoppinsRegular">
          Send messages, share moments, and stay connected with your loved ones anytime, anywhere.
        </Text>
      </View>
      
      {/* Buttons Section */}
      <View className="gap-4">
        <TouchableOpacity 
          className="bg-primary py-4 rounded-xl items-center justify-center shadow-lg"
          onPress={() => router.push("/auth/login")}
        >
          <Text className="text-white text-lg font-PoppinsBold">Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="border-2 border-primary py-4 rounded-xl items-center justify-center"
          onPress={() => router.push("/auth/signup")}
        >
          <Text className="text-primary text-lg font-PoppinsBold">Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}