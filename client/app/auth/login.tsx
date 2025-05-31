import { View, Text, TextInput, TouchableOpacity, Image, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { authStore } from '@/stores/authStore';
import Toast from 'react-native-toast-message';
//import {signInWithGoogle} from '@/services/googleAuth';


const Login = () => {
  const {login} = authStore()
   const [dataForm, setDataForm]= useState({
    email: "",
    password: ""
  })

  const handleSubmit = ()=>{
      try{
        if (dataForm.email === "" || !dataForm.password === "") {
         Toast.show({
           type: 'error',
           text1: 'Please fill in all fields',
           text2: 'This is some something 👋',
           position: 'top'
         });
            return
          }
          // make API call here to login user with provided dataForm
          login(dataForm)
      }
      catch(error){
            console.log(error);
      } 
    }
   
   const router = useRouter()
   const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
       console.log("Google login");
       
      // Send userInfo.idToken to backend...
    } catch (err) {
      console.log('Login failed', err);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      {/* Header Section */}
      <View>
        <Text className="text-center text-primary text-3xl font-PoppinsBold mb-4">
          Login here
        </Text>
        <Text className="text-center text-black text-xl font-PoppinsRegular">
          Welcome back you've
        </Text>
        <Text className="text-center text-black text-xl font-PoppinsRegular mb-8">
           been missed!
        </Text>

        {/* login form inputs*/}
        <View className="mt-9 flex-col gap-3">
          {/* Input Fields */}
          <TextInput 
            placeholder="Email"
            value={dataForm.email}
            onChangeText={(text) => setDataForm({...dataForm, email: text})}
            className="border rounded-lg p-4 mb-2 bg-blue-50 border-gray-300 border-2 focus:border-primary font-PoppinsRegular"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput 
            placeholder="Password"
            value={dataForm.password}
            onChangeText={(text) => setDataForm({...dataForm, password: text})}
            secureTextEntry={true}
            className="border rounded-lg p-4 mb-2 bg-blue-50 border-gray-300 border-2 focus:border-primary font-PoppinsRegular"
            placeholderTextColor="#9CA3AF"
          />
          
          <TouchableOpacity className="items-end">
            <Text className="text-primary font-medium font-PoppinsRegular">Forgot Password?</Text>
          </TouchableOpacity>
          
          {/* Login Button */}
          <TouchableOpacity className="bg-primary py-4 rounded-lg items-center justify-center mt-4" onPress={() => handleSubmit()}>
            <Text className="text-white text-lg font-PoppinsRegular">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Create Account Button */}
      <TouchableOpacity onPress={()=>{router.push("/auth/signup")}}><Text className='text-center text-xl font-PoppinsRegular text-gray-black mt-4 mb-20'>Create an account</Text></TouchableOpacity>
      {/* Or continue with */}
      <Text className='text-center text-xl font-PoppinsBold text-primary'>Or continue with</Text>
    {/* Google Login Button */}
    <TouchableOpacity 
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          paddingVertical: 12,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#D1D5DB",
          marginTop: 16
        }}
        onPress={() => handleGoogleLogin()}
      >
        <Image 
          source={require("../../assets/images/google-icon.png")}
          style={{ width: 24, height: 24, marginRight: 8 }}
        />
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151" }}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Login