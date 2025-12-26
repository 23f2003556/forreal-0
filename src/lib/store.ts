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
    setCurrentUser: (user: UserProfile | null) => void
    setActiveRoomId: (roomId: string | null) => void
}

export const useChatStore = create<ChatState>((set) => ({
    currentUser: null,
    activeRoomId: null,
    setCurrentUser: (user) => set({ currentUser: user }),
    setActiveRoomId: (roomId) => set({ activeRoomId: roomId }),
}))
