import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import BackButton from '@/components/atoms/backButton'
import { FontAwesome5, MaterialIcons, Feather, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
import { useFilesUploader } from '@/hooks/useFilesUploader'
import { UseUserById } from '@/lib/queries'
import { authStore } from '@/stores/authStore'
import { SafeAreaView } from "react-native-safe-area-context";
import {updateUserPicture} from "@/utils/uploadFilesToServer"
import { chatUiStore } from '@/stores/chatUiStaore'

const Settings = () => {


    const {pickImages} = useFilesUploader()
    const {authUser} = authStore()
    const {files,clearFiles} = chatUiStore()
    const {data: userData, isLoading} = UseUserById(authUser?._id)

    console.log("files",files);
    

    const handleUploadPicture = ()=>{
        if(!files) return;
        updateUserPicture(files,authUser?._id)
      clearFiles()
    }

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2449BF" />
            </View>
        )
    }

    if (!userData) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>No user data found</Text>
            </View>
        )
    }

    return (
        <ScrollView className='flex-1 bg-gray-50'>
        <View className='w-full flex-row items-center justify-between px-4'>
  <BackButton />
  <Text className='text-2xl font-PoppinsBold mt-2 text-gray-800'>Your Profile</Text>
  <View style={{ width: 24 }} /> {/* Spacer same width as BackButton */}
</View>

            
            {/* Profile picture with camera icon */}
            <View className='w-full flex justify-center items-center mt-6'>
                <View className='w-[120px] h-[120px] rounded-full bg-rose-100 relative justify-center items-center border-2 border-rose-200'>
                <Image 
  className='w-full h-full rounded-full' 
  source={userData?.picture ? { uri: userData?.picture } : files.length > 0 ? { uri: files[0].uri } : require('@/assets/images/unknown-person.jpg')}
  resizeMode='cover'
/>

                    <TouchableOpacity className='absolute p-2 bg-white rounded-full bottom-0 right-0 border border-gray-200' onPress={()=>{
                        pickImages();
                        //handleUploadPicture()
                    }}>
                        <FontAwesome5 name="camera" size={16} color="#ff006e" />
                    </TouchableOpacity>
                </View>
            </View>
            
            {/* Profile Info Section */}
            <View className='mt-8 px-6'>
                <View className='flex-row items-center mb-1 justify-center '>
                    <Text className='text-2xl font-PoppinsBold text-gray-800'>{userData?.username}</Text>
                    <MaterialIcons name="verified" size={20} color="#3b82f6" style={{marginLeft: 6}} />
                </View>
                <View className='flex-row items-center justify-center'>
                    <Feather name="user" size={16} color="#6b7280" />
                    <Text className='text-gray-600 ml-2'>23 year old dev from algeria</Text>
                </View>
                <View className='flex-row items-center mt-1 justify-center'>
                    <Feather name="calendar" size={16} color="#6b7280" />
                    <Text className='text-gray-500 ml-2'>Active since - {new Date(userData?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</Text>
                </View>
                
                {/* Divider */}
                <View className='border-b border-gray-200 my-6' />
                
                {/* Personal Info Section */}
                <View className='flex-row justify-between w-full'>
                    <Text className='text-lg font-PoppinsSemiBold mb-4 text-gray-800 font-PoppinsBold'>Personal Info</Text>
                    <TouchableOpacity>
                    <Text className='text-lg font-PoppinsSemiBold mb-4 text-gray-800 font-PoppinsRegular'>Edit</Text>
                    </TouchableOpacity>
                </View>
                
                <View className='mb-5 rounded-2xl flex-col gap-2 border border-gray-300'>
                    <TouchableOpacity className='flex-row items-center justify-between p-4 border-b border-gray-200'>
                        <View className='flex-row gap-2 items-center'>
                            <MaterialCommunityIcons name="email-outline" size={20} color="#2449BF" />
                            <Text className='text-gray-500 text-sm font-PoppinsRegular'>Email</Text>
                        </View>
                        <Text className='font-PoppinsRegular'>{userData?.email}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity className='flex-row items-center justify-between p-4 border-b border-gray-200'>
                        <View className='flex-row gap-2 items-center'>
                            <Feather name="phone" size={20} color="#2449BF" />
                            <Text className='text-gray-500 text-sm font-PoppinsRegular'>Phone</Text>
                        </View>
                        
                        <Text className='font-PoppinsRegular'>+213562638002</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity className='flex-row items-center  justify-between  p-4'>
                        <View className='flex-row gap-2 items-center'>
                            <Entypo name="location-pin" size={20} color="#2449BF" />
                            <Text className='text-gray-500 text-sm font-PoppinsRegular'>Location</Text>
                        </View>
                        
                        <Text className='font-PoppinsRegular'>algeria</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Divider */}
                <View className='border-b border-gray-200 my-4' />
                
                {/* Utilities Section */}
                <Text className='text-lg font-PoppinsSemiBold mb-4 text-gray-800'>Utilities</Text>
                
                <View className='bg-white rounded-xl shadow-sm overflow-hidden'>
                    <TouchableOpacity className='flex-row items-center p-4 border-b border-gray-100'>
                        <MaterialCommunityIcons name="download" size={20} color="#2449BF" />
                        <Text className='ml-3'>Downloads</Text>
                        <View className='ml-auto'>
                            <Feather name="chevron-right" size={20} color="#2449BF" />
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity className='flex-row items-center p-4'>
                        <Ionicons name="help-circle-outline" size={20} color="#2449BF" />
                        <Text className='ml-3'>Help</Text>
                        <View className='ml-auto'>
                            <Feather name="chevron-right" size={20} color="#2449BF" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default Settings