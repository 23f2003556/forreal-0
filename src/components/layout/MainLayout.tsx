"use client"

import React from 'react'
import { Sidebar } from '../sidebar/Sidebar'
import { ChatWindow } from '../chat/ChatWindow'
import { useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'

export function MainLayout() {
    const { activeRoomId } = useChat()

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
