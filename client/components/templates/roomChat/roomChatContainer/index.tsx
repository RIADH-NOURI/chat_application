import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useRef } from "react";
import RenderItem from "./renderItem";
import Loading from "@/components/moleculles/loading";
import ImagePreview from "@/components/moleculles/imagePreview";
import { chatUiStore } from "@/stores/chatUiStaore";
import { roomChatStore } from "@/stores/roomChatStore";
import { Ionicons } from "@expo/vector-icons";
import { RoomMessage } from "@/types";

type RoomChatContainerProps = {
  roomMessages: RoomMessage[];
  isLoading: boolean;
  loadMOreMessages: () => void;
};


const RoomChatContainer = ({roomMessages,isLoading,loadMOreMessages}:RoomChatContainerProps) => {
      const flatListRef = useRef<FlatList>(null);
        const {files} = chatUiStore();
        const {isLoading:isLoadingPictures} = roomChatStore();
    

     const renderItem = ( { item, index }: { item: any; index: number } )=>(
        <RenderItem roomMessage={item} index={index} />
     )
  return (
    <>
       {isLoading ? (
             <View className="flex-1 items-center justify-center">
               <ActivityIndicator size="large" color="#0000ff" />
             </View>
           ) : (
             <FlatList
               ref={flatListRef}
               className="flex-1 bg-gray-50 mb-12 pr-4 pt-4 relative z-1"
               contentContainerStyle={{ paddingBottom: 20 }}
               data={roomMessages || []}
               keyExtractor={(item) => item?._id}
               extraData={[roomMessages]}
               renderItem={renderItem}
               showsVerticalScrollIndicator={false}
               onEndReached={loadMOreMessages}
               onEndReachedThreshold={0.1}
               ListEmptyComponent={
                <View className="flex-1 items-center justify-center px-6 py-12 bg-gray-100 rounded-xl shadow-md mx-4 mt-8">
      <Ionicons name="chatbubble-ellipses-outline" size={64} color="#9CA3AF" />
      <Text className="text-xl font-semibold text-gray-500 mt-4">No messages yet</Text>
      <Text className="text-sm text-gray-400 text-center mt-2 font-PoppinsBold">
        Start a conversation and your messages will appear here.
      </Text>
    </View>
               }
               ListFooterComponent={
                 isLoading && (
                   <ActivityIndicator
                     size="small"
                     color="#888"
                     style={{ margin: 10 }}
                   />
                 )
               }
               inverted={true}
             />
           )}
             {files.length > 0 && <ImagePreview isCachedImage={true} images={files} />}
             {isLoadingPictures && <Loading />}
    </>
  );
};

export default RoomChatContainer;
