import { create } from 'zustand'

interface UserProfile {
    id: string
    username: string
    avatar_url: string
    status: string
}

interface ChatState {
    currentUser: UserProfile | null
    activeRoomId: string | null
    rooms: any[]
    messages: any[]
    setCurrentUser: (user: UserProfile | null) => void
    setActiveRoomId: (roomId: string | null) => void
    setRooms: (rooms: any[]) => void
    setMessages: (messages: any[]) => void
    addMessage: (message: any) => void
}

export const useChatStore = create<ChatState>((set) => ({
    currentUser: null,
    activeRoomId: null,
    rooms: [],
    messages: [],
    setCurrentUser: (user) => set({ currentUser: user }),
    setActiveRoomId: (roomId) => set({ activeRoomId: roomId }),
    setRooms: (rooms) => set({ rooms }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}))
