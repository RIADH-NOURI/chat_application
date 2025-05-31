import { View, Text ,Dimensions, Image,ActivityIndicator} from 'react-native'
import React from 'react'
import { useLocalSearchParams } from "expo-router";
import Carousel from 'react-native-reanimated-carousel';
import { UseGetImagesByMessageId } from '@/lib/queries';

const {width} = Dimensions.get("window");


const ImagesByMessageId = () => {
  const { id } = useLocalSearchParams();
  const {data:images, isLoading} = UseGetImagesByMessageId(id as string);
  return (
    <View className="flex-1 bg-white items-center justify-center" style={{width:width}}>
      {isLoading ? (
        <View className="flex-1">
          <ActivityIndicator size="large" color="#2449BF" />
          <Text className="text-gray-400 mt-4">Loading images...</Text>
        </View>
      ) : (
        <Carousel
          width={width}
          height={500}
          data={images?.images || []}
          renderItem={({ item }) => (
            <View className="min-h-full w-full justify-center items-center">
              <Image
                source={{ uri: item }}
                className='w-full h-full rounded-lg'
                resizeMode="cover"
              />
            </View>
          )}
      
        />
      )}
     
    </View>
  )
}

export default ImagesByMessageId