import { View, Text, Image, TouchableOpacity, Linking, Pressable } from 'react-native'
import React from 'react'
import { chatUiStore } from '@/stores/chatUiStaore';
import { roomChatStore } from '@/stores/roomChatStore';
import { authStore } from '@/stores/authStore';
import ReactionList from '@/components/moleculles/reactionsList';
import { getLink } from '@/utils/getLink';
import ImagePreview from '@/components/moleculles/imagePreview';
import { FormatTime } from '@/utils/formatTime';
import { getGroupedReactions } from '@/utils/getGroupedReactionsList';
import { RoomMessage, User } from '@/types';


const RenderItem = ({ roomMessage, index }: { roomMessage: RoomMessage, index: number }) => {
   const { authUser } = authStore();
  
    const {
      setSelectedMessage,
      setShowOptions,
      reactionMessageId,
      setReactionMessageId,
      files,
    } = chatUiStore();
  
    const { addRoomReaction, selectedRoomId, isLoading: isLoadingPictures } = roomChatStore();
  
    const handleLongPress = (roomMessage: RoomMessage) => {
      setSelectedMessage(roomMessage);
      setShowOptions(true);
    };
  
    const handleReactionLongPress = (messageId : string) => {
      setReactionMessageId(messageId);
    };
  
    const handleAddReaction = (emoji: string) => {
      if (!reactionMessageId || !authUser?._id || !emoji) return;
      addRoomReaction(selectedRoomId as string, reactionMessageId, authUser._id, emoji);
      setReactionMessageId(null);
      setShowOptions(false);
    };
  
    const isMe = roomMessage?.senderId?._id === authUser._id;
    const isSelectedForReaction = reactionMessageId === roomMessage?._id;
    const groupedReactions = getGroupedReactions(roomMessage?.reactions || []);

    return (
      <Pressable
        className={`pb-3 pt-10 mb-5 ${isMe ? "items-end" : "items-start"}`}
        onPress={() => {
          setShowOptions(false);
          setReactionMessageId(null);
        }}
      >
        <View
          className={`flex ${
            isMe ? "flex-row-reverse" : "flex-row"
          } items-end gap-2 max-w-[90%]`}
        >
          {!isMe && (
            <Image
              source={
                roomMessage?.senderId?.picture
                  ? { uri: roomMessage?.senderId?.picture }
                  : require("@/assets/images/unknown-person.jpg")
              }
              className="w-8 h-8 rounded-full border border-gray-200"
            />
          )}
          <View className={`flex-1 ${isMe ? "items-end" : "items-start"}`}>
            {!isMe && (
              <Text className="text-xs text-gray-500 mb-1 ml-1">
                {roomMessage?.senderId?.username}
              </Text>
            )}
            {isSelectedForReaction && (
              <View
                className={`absolute z-50 ${
                  isMe ? "right-10" : "left-10"
                } -top-16`}
              >
                <ReactionList handleAddReaction={handleAddReaction} />
              </View>
            )}
            <TouchableOpacity
              activeOpacity={0.7}
              onLongPress={() => {
                handleLongPress(roomMessage);
                handleReactionLongPress(roomMessage._id);
              }}
              delayLongPress={200}
              onPress={() => {
                setShowOptions(false);
                setReactionMessageId(null);
              }}
            >
              {roomMessage?.text && (
                <View
                  className={`rounded-2xl py-2 px-3 ${
                    isMe
                      ? "bg-blue-500 rounded-tr-none"
                      : "bg-gray-200 rounded-tl-none"
                  }`}
                >
                  <Text
                    className={`${
                      isMe ? "text-white" : "text-gray-800"
                    } text-base flex flex-wrap`}
                  >
                    {roomMessage.text
                      .split(/(https?:\/\/[^\s]+)/g)
                      .map((part, i) => {
                        const isLink = getLink(part);
                        return isLink ? (
                          <Text
                            key={`${roomMessage._id}`} // ✅ FIXED
                            className="text-white underline"
                            onPress={() => Linking.openURL(part)}
                          >
                            {part}
                          </Text>
                        ) : (
                          <Text key={`${roomMessage._id}-text-${i}`}>{part}</Text> // ✅ FIXED
                        );
                      })}
                  </Text>
                </View>
              )}
              {roomMessage?.images?.length > 0 && (
                <View className="mb-2">
                  <ImagePreview
                    images={roomMessage.images}
                  />
                </View>
              )}
            </TouchableOpacity>
            {groupedReactions?.length > 0 && (
              <View
                className={`flex-row items-center mt-1 px-2 py-1 rounded-xl bg-white shadow-sm ${
                  isMe ? "self-end" : "self-start"
                }`}
                style={{ elevation: 2 }}
              >
                {groupedReactions.map(({ emoji, count }) => (
                  <View
                    key={`${roomMessage?._id}-${emoji}`} // ✅ FIXED
                    className="flex-row items-center mx-1"
                  >
                    <Text className="text-base">{emoji}</Text>
                    <Text className="text-xs text-gray-600 ml-0.5">
                      {count}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            <Text className="text-xs text-gray-500 mt-1 mr-3">
              {FormatTime(roomMessage?.createdAt)}
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center justify-end space-x-1 mr-3 mt-1">
  {roomMessage?.usersRead?.length > 0 && index === 0 && (
    <>
      {/* Profile picture avatars */}
      <View className="flex flex-row -space-x-2">
        {roomMessage.usersRead.slice(0, 3).map((user: User) => (
          <View 
            key={user._id}
            className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
          >
            {user?.picture ? (
              <Image 
                source={{ uri: user.picture }} 
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full flex items-center justify-center bg-blue-500">
                <Text className="text-xs text-white font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        ))}
        {roomMessage?.usersRead?.length > 3 && (
          <View className="w-5 h-5 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center">
            <Text className="text-xs text-blue-600 font-medium">
              +{roomMessage.usersRead.length - 3}
            </Text>
          </View>
        )}
      </View>
      
      {/* Seen text with nice icon */}
      <View className="flex flex-row items-center">
        <Text className="text-xs text-gray-500 ml-1">Seen</Text>
      </View>
    </>
  )}
</View>
      </Pressable>
    );
}

export default RenderItem