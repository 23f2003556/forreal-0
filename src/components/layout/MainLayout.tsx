"use client"

import React from 'react'
import { Sidebar } from '../sidebar/Sidebar'
import { ChatWindow } from '../chat/ChatWindow'
import { useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export function MainLayout() {
    const { activeRoomId, currentUser, loading } = useChat()
    const router = useRouter()

    React.useEffect(() => {
        if (!loading) {
            if (!currentUser) {
                router.push('/login')
            } else if (!currentUser.username || currentUser.username.startsWith('user_')) {
                router.push('/setup-profile')
            }
        }
    }, [loading, currentUser, router])

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-app-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-primary"></div>
            </div>
        )
    }

    if (!currentUser) return null

    return (
        <div className="flex h-screen w-full overflow-hidden bg-app-background">
            {/* Sidebar - Visible on desktop, or on mobile when no chat is active */}
            <div className={cn(
                "w-full md:w-auto md:flex-none",
                activeRoomId ? "hidden md:block" : "block"
            )}>
                <Sidebar />
            </div>

            {/* Main Chat Area - Visible on desktop, or on mobile when chat IS active */}
            <div className={cn(
                "flex-1 min-w-0",
                activeRoomId ? "flex" : "hidden md:flex"
            )}>
                <ChatWindow />
            </div>
        </div>
    )
}
