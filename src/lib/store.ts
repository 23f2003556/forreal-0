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
    unreadCounts: Record<string, number>
    roomModes: Record<string, 'work' | 'chill' | 'love' | null>
    setCurrentUser: (user: UserProfile | null) => void
    setActiveRoomId: (roomId: string | null) => void
    setRooms: (rooms: any[]) => void
    setMessages: (messages: any[]) => void
    addMessage: (message: any) => void
    updateMessage: (id: string, updates: any) => void
    setUnreadCount: (roomId: string, count: number) => void
    setRoomMode: (roomId: string, mode: 'work' | 'chill' | 'love' | null) => void
}

export const useChatStore = create<ChatState>((set) => ({
    currentUser: null,
    activeRoomId: null,
    rooms: [],
    messages: [],
    unreadCounts: {},
    roomModes: {},
    setCurrentUser: (user) => set({ currentUser: user }),
    setActiveRoomId: (roomId) => set({ activeRoomId: roomId }),
    setRooms: (rooms) => set({ rooms }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map((m) => (m.id === id ? { ...m, ...updates } : m))
    })),
    setUnreadCount: (roomId, count) => set((state) => ({
        unreadCounts: { ...state.unreadCounts, [roomId]: count }
    })),
    setRoomMode: (roomId, mode) => set((state) => ({
        roomModes: { ...state.roomModes, [roomId]: mode }
    })),
}))
