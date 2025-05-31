

import ImagePreview from "@/components/moleculles/imagePreview";
import ReactionList from "@/components/moleculles/reactionsList";
import { authStore } from "@/stores/authStore";
import { chatUiStore } from "@/stores/chatUiStaore";
import { privateChatStore } from "@/stores/privateChatStore";
import { FormatTime } from "@/utils/formatTime";
import { getGroupedReactions } from "@/utils/getGroupedReactionsList";
import { getLink } from "@/utils/getLink";
import { Ionicons } from "@expo/vector-icons";
import {
    View,
    Text,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    Pressable,
    Alert,
    Linking,
  } from "react-native";
  import { PrivateChatMessage } from "@/types";
  import { useRouter } from "expo-router";
 

  type RenderItemProps = {
    message: PrivateChatMessage | null;
    index: number;
  };


const RenderItem = ({message,index}:RenderItemProps) => {
    const { authUser } = authStore();
    const router = useRouter();
    const availableImages = message?.images?.length > 0;
    if (!message) return 
  <View className="flex-1 items-center justify-center bg-red-600">
              <Text className="text-gray-400">No messages yet</Text>
            </View>
  const {
    setSelectedMessage,
    setShowOptions,
    reactionMessageId,
    setReactionMessageId,
    files,
  } = chatUiStore();

  const { addReaction, isLoading: isLoadingPictures } = privateChatStore();


  const handleOnPress = () => {
    router.push(`/images/${message?._id}`);
    setShowOptions(false);
    setSelectedMessage(null);
    setReactionMessageId(null);
  }

  const handleReactionLongPress = (messageId : string) => {
    setReactionMessageId(messageId);
  };

  const handleLongPress = (message: PrivateChatMessage) => {
    setSelectedMessage(message);
    setShowOptions(true);
  };

  const handleAddReaction = (emoji: string) => {
    if (!reactionMessageId || !authUser?._id || !emoji) return;
    addReaction(reactionMessageId, authUser._id, emoji);
    setReactionMessageId(null);
    setShowOptions(false);
  };
   
  const isMe = message?.senderId?._id === authUser?._id;
    const isSelectedForReaction = reactionMessageId === message?._id;
    const groupedReactions = getGroupedReactions(message?.reactions || []);

    return (
      <>
      <Pressable
        className={`pb-3 pt-10 mb-5 ${isMe ? "items-end" : "items-start"}`}
        onPress={() => {
          setShowOptions(false);
          setReactionMessageId(null);
          setSelectedMessage(null)
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
                message?.senderId?.picture
                  ? { uri: message?.senderId?.picture }
                  : require("@/assets/images/unknown-person.jpg")
              }
              className="w-8 h-8 rounded-full border border-gray-200"
            />
          )}
          <View className={`flex-1 ${isMe ? "items-end" : "items-start"}`}>
            {!isMe && (
              <Text className="text-xs text-gray-500 mb-1 ml-1">
                {message?.senderId?.username}
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
                handleLongPress(message);
                handleReactionLongPress(message?._id);
              }}
              delayLongPress={200}
              onPress={() => {
                if (availableImages) {
                  handleOnPress();
                } else {
                  setShowOptions(false);
                  setSelectedMessage(null);
                  setReactionMessageId(null);
                }
              }}
            >
              {message?.text && (
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
                  {message.text
  .split(/(https?:\/\/[^\s]+)/g)
  .map((part, i) => {
    const isLink = getLink(part);
    return isLink ? (
      <Text
        key={`${message._id}-link-${i}`}
        className="text-black underline"
        onPress={() => Linking.openURL(part)}
      >
        {part}
      </Text>
    ) : (
      <Text key={`${message._id}-text-${i}`}>{part}</Text>
    );
  })}
                  </Text>
                </View>
              )}
              {message?.files?.length > 0 && (
                <TouchableOpacity
                  className={`mt-2 flex-row items-center px-4 py-2 rounded-xl ${
                    isMe ? "bg-blue-100" : "bg-gray-100"
                  }`}
                  onPress={() => {
                    // Handle file download or preview
                    Alert.alert("File", "Would you like to download this file?");
                  }}
                >
                  <Ionicons
                    name="document-text-outline" 
                    size={20} 
                    color={isMe ? "#2563eb" : "#4b5563"} 
                  />
                  <Text 
                    className={`ml-2 text-sm font-medium ${
                      isMe ? "text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {message.files.length} {message.files.length === 1 ? 'File' : 'Files'}
                  </Text>
                </TouchableOpacity>
              )}
              {message?.images?.length > 0 && (
                <View className="mb-2">
                  <ImagePreview
                    images={message.images}
                    isLoadingPictures={isLoadingPictures}
                  />
                </View>
              )}
            </TouchableOpacity>
            {groupedReactions.length > 0 && (
              <View
                className={`flex-row items-center mt-1 px-2 py-1 rounded-xl bg-white shadow-sm ${
                  isMe ? "self-end" : "self-start"
                }`}
                style={{ elevation: 2 }}
              >
              {groupedReactions.map(({ emoji, count }, idx) => (
  <View
    key={`${message?._id}-reaction-${emoji}-${idx}`}
    className="flex-row items-center mx-1"
  >
    <Text className="text-base">{emoji}</Text>
    <Text className="text-xs text-gray-600 ml-0.5">{count}</Text>
  </View>
))}

              </View>
            )}
            <Text className="text-xs text-gray-500 mt-1 mr-3">
              {FormatTime(message?.createdAt)}
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center justify-end space-x-1 mr-3 mt-1">
  {message?.usersRead?.length > 0 && index === 0 && (
    <>
      {/* Profile picture avatars */}
      <View className="flex flex-row -space-x-2">
        {message.usersRead.slice(0, 3).map((user) => (
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
                {(user?.username?.[0] || "?").toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        ))}
        {message.usersRead.length > 3 && (
          <View className="w-5 h-5 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center">
            <Text className="text-xs text-blue-600 font-medium">
              +{message.usersRead.length - 3}
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
    
      </>
    );
  };


  export default RenderItem;