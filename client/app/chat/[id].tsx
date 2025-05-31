// =======================
// Imports
// =======================
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import HeaderPrivateSection from "@/components/templates/privateChat/headerPrivateChat";
import { privateChatStore } from "@/stores/privateChatStore/index";
import FooterChatSection from "@/components/layout/footerSection";
import ChatMessagesContainer from "@/components/templates/privateChat/chatMessagesContainer";
import { UseGetMessages, UseUserById } from "@/lib/queries";
import { queryClient } from "@/hooks/useFetch";
import UploadForm from "@/components/moleculles/uploadForm";
import { chatUiStore } from "@/stores/chatUiStaore";
import { authStore } from "@/stores/authStore";
import MoreOptionsModel from "@/components/moleculles/moreOptionsModel";
import useToggleVisibility from "@/hooks/useToggleVisibility";
import { PrivateChatMessage, User } from "@/types";

// =======================
// Component Definition
// =======================
const PrivateChat = () => {
  // =======================
  // States
  // =======================
  const { id: receiverId } = useLocalSearchParams();
  const [privateMessage, sendPrivateMessage] = useState("");
  const { authUser } = authStore();
  const {
    handleCopy,
    selectedMessage,
    setShowOptions,
    showUploadForm,
    setShowUploadForm,
    files,
    clearFiles,
    setScrollOnNextUpdate,
    setReactionMessageId,
  } = chatUiStore();
  const isSendImages = files.length > 0;

  const {
    scaleAnim,
    toggleVisibility,
  } = useToggleVisibility(); // Use the custom hook
  const {
    addUserReadId,
    subscribePrivateMessages,
    unsubscribeMessages,
    deleteMessage,
    sendMessage,
    selectedUserId,
  } = privateChatStore();

  // =======================
  // Data Fetching
  // =======================
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = UseGetMessages(receiverId as string);

  const { data: userData, isLoading: userLoading } = UseUserById(
    receiverId as string
  );

  const messagesFound = data?.pages[0]?.messages || [] as PrivateChatMessage[];

  const allMessages = Array.from(
    new Map(
      data?.pages.flatMap((page) => page.messages).map((msg) => [msg?._id, msg])
    ).values()
  );

  const user = userData as User | undefined;

  // =======================
  // Effects
  // =======================
  useEffect(() => {
    if (selectedUserId && messagesFound?.length > 0) {
      addUserReadId([selectedUserId]);
    }
  }, [selectedUserId, data?.pages]);

  useEffect(() => {
    subscribePrivateMessages();
    return () => unsubscribeMessages();
  }, [subscribePrivateMessages, unsubscribeMessages]);

  // =======================
  // Event Handlers
  // =======================
  const loadMoreMessages = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleSendPrivateMessage = () => {
    sendMessage(privateMessage, receiverId as string, receiverName, files);
    console.log("privateMessage", privateMessage);

    sendPrivateMessage("");
    clearFiles();
    setScrollOnNextUpdate(true);
  };

  const onCopy = () => {
    if (selectedMessage) {
      handleCopy(selectedMessage.text);
      setShowOptions(false);
    }
  };

  const onDelete = () => {
    if (selectedMessage?.senderId?._id !== authUser?._id) {
      deleteMessage(selectedMessage?._id as string, authUser?._id);
    } else {
      deleteMessage(selectedMessage?._id as string);
    }
    queryClient.invalidateQueries({
      queryKey: ["messages", selectedMessage?._id],
    });
    setShowOptions(false);
    setReactionMessageId(null);
  };

  const receiverName = user?.username as string;

  // =======================
  // UI Rendering
  // =======================
  return (
    <Pressable
      className="flex-1 relative"
      onPress={() => setShowOptions(false)}
    >
      {isSendImages && (
        <View className="absolute z-50 bottom-24 right-4 flex-row items-center gap-2">
          <TouchableOpacity
            className="p-3 bg-blue-600 rounded-full"
            onPress={clearFiles}
          >
            <Text className="text-white font-bold">remove</Text>
          </TouchableOpacity>
        </View>
      )}

      <MoreOptionsModel handleCopy={onCopy} handleDelete={onDelete} />

      <UploadForm visible={showUploadForm} scaleAnim={scaleAnim} />
      <HeaderPrivateSection user={user as User} isLoading={userLoading} />

      <ChatMessagesContainer
        messages={allMessages}
        isLoading={isLoading}
        loadMoreMessages={loadMoreMessages}
      />

      <FooterChatSection
        handleSendMessage={handleSendPrivateMessage}
        message={privateMessage}
        setMessage={sendPrivateMessage}
        handleShowUploadForm={toggleVisibility}
      />
    </Pressable>
  );
};

export default PrivateChat;