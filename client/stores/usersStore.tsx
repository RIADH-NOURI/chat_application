import { baseUrl } from "@/hooks/useFetch";
import { create } from "zustand";


interface usersStore {
    user: any[] | null;
    authUserInfo: any[] | null;
    users: any[] | null;
    usersFriends: any[] | null;
    getUsers: (page:number,limit:number,search:string) => Promise<void>;
    getUserById: (userid: string) => Promise<void>;
    getAuthUserId: (userid: string) => Promise<void>;
    getUserFriends: (userId: string,page:number,limit:number,search:string) => Promise<void>;
    addFriend: (friendId: string) => Promise<void>;
    getAllUsers: (page:number,limit:number,search:string) => Promise<void>;
}

export const usersStore = create<usersStore>((set, get) => ({
    users: [],
    user:[],
    authUserInfo: [],
    usersFriends: [],
     getUsers: async (page:number,limit:number,search:string) => {
        try {
          const response = await baseUrl.get(`/users?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },
      getAllUsers: async (page:number,limit:number,search:string) => {
        try {
          const response = await baseUrl.get(`/all/users?page=${page}&limit=${limit}&search=${search}`);
          return response.data;
        } catch (error) {
          console.error("Error fetching all users:", error);
        }
      },
      
      getUserFriends: async (userId,page,limit,search) => {
        try {
          const response = await baseUrl.get(`/user/friends/${userId}?page=${page}&limit=${limit}&search=${search}`);
          return response.data;
        } catch (error) {
          console.error("Error fetching user friends:", error);
        }
      },
      addFriend: async (friendId) => {
        try {
          const response = await baseUrl.post(`/user/add/friend`, { friendId });
          return response.data;
        } catch (error) {
          console.error("Error adding friend:", error);
          throw error
        }
      },
      getUserById: async (id) => {
        try {
          const response = await baseUrl.get(`/user/${id}`);
          set({ user: response.data });
          return response.data;
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      },
      getAuthUserId : async (id) => {
        try {
          const response = await baseUrl.get(`/user/${id}`);
          set({ authUserInfo: response.data });
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      },
}))