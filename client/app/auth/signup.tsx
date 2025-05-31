import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import { authStore } from '@/stores/authStore';
import Toast from 'react-native-toast-message';


const Signup = () => {
   const router = useRouter()
   const {register}= authStore()
   const [secureText, setSecureText] = useState<boolean>(true)
   const [formData,setFormData]= useState({
    email:"",
    password:"",
    confirmPassword:""
   })

   const handleSubmit = ()=>{
        if (!formData.email && !formData.password &&!formData.confirmPassword) {
          Toast.show({
            type: 'error', // 'success', 'error', or 'info'
            text1: '😓😓  Please fill in all fields',
            text2: 'This is some something 👋',
          });          return
        }
        if (formData.password.length < 6) {
          Toast.show({
            type: 'error',
            text1: 'Weak Password',
            text2: 'Password must be at least 6 characters long.'
          }); 
          return
        }
        if (formData.password !== formData.confirmPassword) {
          alert('confirmPassword must be at least 6 characters long.')
          return
        }
   }

  return (
    <View className="flex-1 bg-white p-6">
     <View className='absolute z-50 w-full bg-white text-3xl'>
  <Toast />
</View>

      {/* Header Section */}
      <View>
        <Text className="text-center text-primary text-3xl font-PoppinsBold mb-4">
        Create Account
        </Text>
        <Text className="text-center text-black text-xl font-PoppinsRegular">
           Create an account so that you can 
        </Text>
        <Text className="text-center text-black text-xl font-PoppinsRegular mb-8">
        access  your messages and notifications
        </Text>

        {/* Input Fields */}
        <View className="mt-9 flex-col gap-3">
          <TextInput 
            placeholder="Email"
            value={formData.email}
            onChangeText={(value:string)=>{setFormData({...formData,email:value})}}
            className="border rounded-lg p-4 mb-2 bg-blue-50 border-gray-300 border-2 focus:border-primary font-PoppinsRegular"
            placeholderTextColor="#9CA3AF"
          />
          {/* password input */}
         <View className='flex-row items-center border rounded-lg mb-2 px-3 py-2 bg-blue-50 border-gray-300 border-2 focus:border-primary'>
            <TextInput 
              placeholder="Password"
              value={formData.password}
            onChangeText={(value:string)=>{setFormData({...formData,password:value})}}
              secureTextEntry={secureText}
              className='flex-1 font-PoppinsRegular'
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Feather name={secureText ? "eye-off" : "eye"} size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          {/* confirm password input */}
          <View className='flex-row items-center border rounded-lg mb-2 px-3 py-2 bg-blue-50 border-gray-300 border-2 focus:border-primary'>
            <TextInput 
              placeholder="Confirm Password"
              value={formData.confirmPassword}
            onChangeText={(value:string)=>{setFormData({...formData,confirmPassword:value})}}
              secureTextEntry={secureText}
              className='flex-1 font-PoppinsRegular'
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Feather name={secureText ? "eye-off" : "eye"} size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="items-end">
            <Text className="text-primary font-medium font-PoppinsRegular">Forgot Password?</Text>
          </TouchableOpacity>
          
          {/* Login Button */}
          <TouchableOpacity className="bg-primary py-4 rounded-lg items-center justify-center mt-4" onPress={() => handleSubmit()}>
            <Text className="text-white text-lg font-PoppinsBold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity  onPress={() => {router.push("/auth/login")}}><Text className='text-center text-xl font-PoppinsRegular text-gray-black mt-4 mb-20'>Already have an account?</Text></TouchableOpacity>
    
    </View>
  )
}

export default Signup