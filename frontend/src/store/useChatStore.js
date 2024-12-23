import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isLoadingUsers: false,
  isLoadingMessages: false,

  getUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data.users });
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  getMessages: async (userId) => {
    set({ isLoadingMessages: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...get().messages, res.data] });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  },
  listenForNewMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    try {
      const socket = useAuthStore.getState().socket;

      if (!socket) {
        console.error("Socket is not initialized");
        return;
      }
      socket.on("newMessage", (newMessage) => {
        if (newMessage.senderId !== selectedUser._id) return;
        set({ messages: [...get().messages, newMessage] });
      });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  },
  stopListeningForNewMessages: () => {
    try {
      const socket = useAuthStore.getState().socket;

      if (!socket) {
        console.error("Socket is not initialized");
        return;
      }
      socket.off("newMessage");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
