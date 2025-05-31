// =======================
// Imports
// =======================
import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import HeaderSection from '@/components/templates/newGroup/headerSection';
import UsersCard from '@/components/templates/newGroup/usersCard';
import NewGroupIcon from '@/components/atoms/newGroupIcon';
import InputNameGroup from '@/components/moleculles/inputNameGroup';
import { useRouter } from 'expo-router';
import { UseAllUsers, UseCreateAndJoinRoom } from '@/lib/queries';
import { roomChatStore } from '@/stores/roomChatStore';
import { Users } from '@/types';

// =======================
// Component Definition
// =======================
const CreateGroup = () => {
  // =======================
  // States
  // =======================
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [allUsers, setAllUsers] = useState<Users[]>([]);

  // =======================
  // Stores
  // =======================
  const { setSelectedRoomId } = roomChatStore();

  // =======================
  // Data Fetching
  // =======================
  const router = useRouter();
  const { mutate: createAndJoinRoomMutation, isLoading: isCreatingRoom } = UseCreateAndJoinRoom();
  const { data: allUsersData, isLoading: isLoadingAllUsers } = UseAllUsers(page, limit, '');

  // =======================
  // Effects
  // =======================
  useEffect(() => {
    if (allUsersData?.users as Users[]) {
      setAllUsers((prev) => [...prev, ...allUsersData?.users]);
    }
  }, [allUsersData]);

  // =======================
  // Event Handlers
  // =======================
  const handleCreateRoom = () => {
    createAndJoinRoomMutation(
      { roomName, usersIds: selectedUsers },
      {
        onSuccess: (data) => {
          // Assuming the returned data has room._id
          router.push(`/room/${data?.room?._id}`);
          setSelectedRoomId(data?.room?._id);
        },
        onError: (error) => {
          console.error('Error creating room:', error);
        },
      }
    );
    setSelectedUsers([]);
    setRoomName('');
  };

  const handleLoadMore = () => {
    if (!isLoadingAllUsers && allUsersData?.hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  console.log('selectedUsers', selectedUsers);

  // =======================
  // UI Rendering
  // =======================
  return (
    <View className="flex-1 bg-white relative">
      <HeaderSection />
      <Text className="text-xl font-PoppinsBold m-6">Users</Text>

      <InputNameGroup roomName={roomName} setRoomName={setRoomName} />
      <UsersCard
        users={allUsers}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        handleLoadMore={handleLoadMore}
        isLoadingAllUsers={isLoadingAllUsers}
      />
      <NewGroupIcon
        isSelected={selectedUsers.length > 1 && roomName.trim().length > 0}
        handleCreateRoom={handleCreateRoom}
        isCreatingRoom={isCreatingRoom}
      />
    </View>
  );
};

export default CreateGroup;