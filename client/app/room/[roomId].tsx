// =======================
// Imports
// =======================
import { View, Text, Pressable, Animated } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import HeaderRoomSection from "@/components/templates/roomChat/headerRoomChat";
import { useLocalSearchParams } from "expo-router";
import { roomChatStore } from "@/stores/roomChatStore";
import FooterSection from "@/components/layout/footerSection";
import { authStore } from "@/stores/authStore";
import { privateChatStore } from "@/stores/privateChatStore";
import RoomChatContainer from "@/components/templates/roomChat/roomChatContainer";
import { UseGetRoomMessages } from "@/lib/queries";
import { chatUiStore } from "@/stores/chatUiStaore";
import { queryClient } from "../_layout";
import useToggleVisibility from "@/hooks/useToggleVisibility";
import UploadForm from "@/components/moleculles/uploadForm";
import MoreOptionsModel from "@/components/moleculles/moreOptionsModel";

// =======================
// Component Definition
// =======================
const RoomMessages = () => {
  // =======================
  // States
  // =======================
  const { roomId } = useLocalSearchParams();
  const [roomMessage, sendRoomMessage] = useState("");

  // =======================
  // Stores
  // =======================
  const { authUser } = authStore();
  const {
    joinRoomSocket,
    sendMessageInRoom,
    subscribeRoomMessages,
    deleteMessageFromRoom,
    selectedRoomId,
  } = roomChatStore();
  const { unsubscribeMessages } = privateChatStore();
  const {
    setShowOptions,
    setReactionMessageId,
    selectedMessage,
    handleCopy,
    showUploadForm,
    setShowUploadForm,
  } = chatUiStore();
  const {
   scaleAnim,
    toggleVisibility
  } = useToggleVisibility();

  // =======================
  // Data Fetching
  // =======================
  const {
    data: roomData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingRoomMessages,
  } = UseGetRoomMessages(roomId as string);

  // Safely extract all room objects from the paginated data
  const roomDataPages = roomData?.pages ?? [];
  const allRoomData = roomDataPages.map((page) => page?.room);

  // Safely extract all messages
  const allRoomMessages = Array.from(
    new Map(
      roomData?.pages
        .flatMap((page) => page.messages)
        .map((msg) => [msg?._id, msg])
    ).values()
  );

  // =======================
  // Effects
  // =======================
  useEffect(() => {
    subscribeRoomMessages();
    return () => unsubscribeMessages();
  }, [roomId]);

  useEffect(() => {
    if (roomId && allRoomData.length > 0) {
      const usersIds = allRoomData.flatMap(
        (item) => item?.users?.map((user) => user._id) ?? []
      );
      joinRoomSocket(roomId as string, usersIds as string[]);
      console.log("User IDs in the room:", usersIds);
    }
  }, [roomId, joinRoomSocket, allRoomData]);

  // =======================
  // Event Handlers
  // =======================
  const loadMoreMessages = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleRoomMessage = () => {
    if (!roomMessage.trim()) return;
    sendMessageInRoom(roomMessage, authUser?._id, roomId as string);
    console.log("roomMessage", roomMessage);
    sendRoomMessage("");
  };

  const onDelete = () => {
    if (selectedMessage?.senderId?._id !== authUser?._id) {
      deleteMessageFromRoom(
        selectedRoomId as string,
        selectedMessage?._id as string,
        authUser?._id
      );
    } else {
      deleteMessageFromRoom(
        selectedRoomId as string,
        selectedMessage?._id as string
      );
    }
    queryClient.invalidateQueries({
      queryKey: ["roomData", selectedRoomId],
    });
    setShowOptions(false);
    setReactionMessageId(null);
  };

  const onCopy = () => {
    if (selectedMessage) {
      handleCopy(selectedMessage.text);
      setShowOptions(false);
    }
  };

  // =======================
  // UI Rendering
  // =======================
  return (
    <Pressable
      className="flex-1 bg-white"
      onPress={() => {
        setShowOptions(false);
        setReactionMessageId(null);
      }}
    >
      <MoreOptionsModel handleCopy={onCopy} handleDelete={onDelete} />

      <HeaderRoomSection roomData={allRoomData} />
      <RoomChatContainer
        roomMessages={allRoomMessages}
        isLoading={isLoadingRoomMessages}
        loadMoreMessages={loadMoreMessages}
      />
      <UploadForm visible={showUploadForm} scaleAnim={scaleAnim} />

      <FooterSection
        handleSendMessage={handleRoomMessage}
        message={roomMessage}
        setMessage={sendRoomMessage}
        handleShowUploadForm={toggleVisibility}
      />
    </Pressable>
  );
};

export default RoomMessages;