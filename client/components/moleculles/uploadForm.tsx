import React, { useState, useRef } from 'react';
import { Animated, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons, AntDesign, FontAwesome6  } from '@expo/vector-icons';
import { useFilesUploader } from '@/hooks/useFilesUploader';
import { chatUiStore } from '@/stores/chatUiStaore';

const AnimatedView = Animated.View;

const UploadForm = ({visible,scaleAnim}) => {
  const {takePhoto,pickImages,pickDocument}=useFilesUploader();
  const {setShowUploadForm,setTypeFile} = chatUiStore()



  return (
   <>
   <View className='absolute bottom-14 z-50 w-auto h-auto' >
      {visible && (
        <AnimatedView style={{ transform: [{ scale: scaleAnim }] }} className="flex-row gap-5 items-center justify-center mt-4 bg-gray-50 min-w-full p-10 rounded-2xl">
          <TouchableOpacity className="bg-white p-4 flex rounded-xl items-center  justify-center shadow-md" onPress={()=>{
            takePhoto();
            setTypeFile("image")
            setShowUploadForm(false)
          }}>
            <FontAwesome5 name="camera" size={22} color="#ff006e" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white p-4 rounded-xl items-center justify-center shadow-md" onPress={()=>{
            pickImages();
            setTypeFile("image")
            setShowUploadForm(false)
          }}>
            <MaterialIcons name="photo-library" size={22} color="#2f6690" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white p-4 rounded-xl items-center justify-center shadow-md" onPress={()=>{
            pickDocument();
            setTypeFile("document")
            setShowUploadForm(false)
          }}>
          <FontAwesome6 name="file-text" size={22} color="#7209b7"  />
          </TouchableOpacity>
        </AnimatedView>
      )}
      </View>
      </>
  );
};

export default UploadForm;
