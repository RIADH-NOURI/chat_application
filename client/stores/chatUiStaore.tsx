// stores/chatUiStore.ts
import { create } from "zustand";
import * as Clipboard from "expo-clipboard";

interface Message {
  _id: string;
  text: string;
  senderId?: {
    _id: string;
  };
}

interface ChatUiStore {
  // UI State
  selectedMessage: Message | null;
  setSelectedMessage: (message: Message | null) => void;

  showOptions: boolean;
  setShowOptions: (show: boolean) => void;

  reactionMessageId: string | null;
  setReactionMessageId: (id: string | null) => void;
  showUploadForm: boolean;
  setShowUploadForm: (show: boolean) => void;

  files: string[];
  setFiles: (files: string[]) => void;

  selectedFriendId: string | null;
  setSelectedFriendId: (id: string | null) => void;
  scrollOnNextUpdate: boolean;
  setScrollOnNextUpdate: (scroll: boolean) => void;

  search : string | null,
  setSearch : (search : string | null) => void,

  // typefile 
  typeFile :string | null,
  setTypeFile : (typeFile : string) => void

  // Actions
  handleCopy: (text: string) => Promise<void>;
  addFiles: (newFiles: string[]) => void;
  clearFiles: () => void;
}

export const chatUiStore = create<ChatUiStore>((set, get) => ({
  // UI State

  search: null,
  setSearch: (search) => set({ search }),
  selectedMessage: null,
  setSelectedMessage: (message) => set({ selectedMessage: message }),

  showOptions: false,
  setShowOptions: (show) => set({ showOptions: show }),

  reactionMessageId: null,
  setReactionMessageId: (id) => set({ reactionMessageId: id }),

  showUploadForm: false,
  setShowUploadForm: (show) => set({ showUploadForm: show }),

  files: [],
  setFiles: (files) => set({ files }),

  scrollOnNextUpdate: false,
  setScrollOnNextUpdate: (scroll) => set({ scrollOnNextUpdate: scroll }),

  typeFile: null,
  setTypeFile:(typeFile)=> set({typeFile:typeFile}),

  // Actions
  handleCopy: async (text) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
  },

  addFiles: (newImages) =>
    set((state) => ({ files: [...state.files, ...newImages] })),
  clearFiles: () => set({ files: [] }),

  selectedFriendId: null,
  setSelectedFriendId: (id) => set({ selectedFriendId: id }),
}));
