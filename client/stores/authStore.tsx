import { baseUrl, queryClient } from "@/hooks/useFetch";
import { io } from "socket.io-client";
import { create } from "zustand";

const BASEURL = "http://192.168.1.39:5000";

interface authStore {
  isCheckingAuth: boolean;
  authUser: any | null;
  socket: any | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  checkHealth: () => void;
  onlineUsers: any[] | null;
  logout: () => Promise<void>;
  socketConnect: () => void;
  disconnectSocket: () => void;
}

export const authStore = create<authStore>((set, get) => ({
  isCheckingAuth: true,
  authUser: null,
  socket: null,
  onlineUsers: [],
  login: async (data: { email: string; password: string }) => {
    try {
      const response = await baseUrl.post("/auth/login", data);

      console.log("response",response);
      

      set({ isCheckingAuth: false, authUser: response.data.user });
      get().checkHealth();
      get().socketConnect();
      return response.data;
    } catch (error) {
      console.error(error);
      set({ isCheckingAuth: false, authUser: null });
      return error;
    }
  },
  logout: async () => {
    try {
      await baseUrl.get("/auth/logout");
      set({ isCheckingAuth: false, authUser: null });
      queryClient.clear();
      //get().disconnectSocket();
    } catch (error) {
      console.error(error);
      set({ isCheckingAuth: false, authUser: null });
    }
  },
  register: async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await baseUrl.post("/auth/register", data);
      set({ isCheckingAuth: false, authUser: null });
    } catch (error) {
      console.error(error);
      set({ isCheckingAuth: false, authUser: null });
    }
  },
  checkHealth: async () => {
    try {
      set({ isCheckingAuth: true });
      const response = await baseUrl.get("/auth/checkHealth");
      set({ 
        isCheckingAuth: false, 
        authUser: response.data || null 
      });
      
      if (response.data) {
        get().socketConnect();
      }
      
      return response.data;
    } catch (error) {
      console.error("Health check failed:", error);
      set({ 
        isCheckingAuth: false, 
        authUser: null 
      });
      return null;
    }
  },
  socketConnect: () => {
    const { authUser } = get();
    if (!authUser) {
      console.log("Socket not connected");
      return;
    }
    const newSocket = io(BASEURL, {
      transports: ["websocket"],
      query: {
        userId: authUser._id,
      },
    });
    {
      /*connect socket event*/
    }
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });
    {
      /*getOnlineSocket event*/
    }

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
    set({ socket: newSocket });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (!socket) return;
    socket.disconnect();
    set({ socket: null });
  },
}));
