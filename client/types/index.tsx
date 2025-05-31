



export interface Pagination {
    totalPages: number;
    currentPage: number;
    limit: number;
  }
  
  export interface User {
    _id: string;
    username: string;
    picture: string;
  }
  
  export interface Reaction {
    userId: string;
    emoji: string;
    _id: string;
  }
  
  export interface RoomMessage {
    _id: string;
    senderId: User;
    roomId: string;
    text: string;
    images: string[];
    files: string[];
    deletedBy: string[];
    isRead: boolean;
    usersRead: string[];
    createdAt: string;
    updatedAt: string;
    reactions: Reaction[];
    __v: number;
  }
  
  export interface Room {
    _id: string;
    name: string;
    users?: User[];
  }
  
  export interface roomChatResponse {
    pagination?: Pagination;
    hasMore?: boolean;
    room?: Room;
    messages?: RoomMessage[];
  }
  export interface PrivateChatMessage {
    _id: string;
    senderId: User;
    receiverId?: User; // Optional if used in one-to-one messages
    text: string;
    deletedBy: string[];
    images: string[];
    files: string[];
    isRead: boolean;
    usersRead: User[]; // Updated to hold full user objects
    reactions: Reaction[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface privateChatResponse {
    pagination?: Pagination;
    hasMore?: boolean;
    messages?: PrivateChatMessage[];
  }

  export interface Rooms {
    rooms: Room[];
  }
  export interface Users {
    users: User[];
  }
  export interface UserFriends {
    friends: User[];
  } 
  export interface PaginatedResponse<T> {
    hasMore: boolean;
    [key: string]: T[];
  }
  