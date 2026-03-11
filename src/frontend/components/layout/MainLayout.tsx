"use client"

import React from 'react'
import { Sidebar } from '../sidebar/Sidebar'
import { ChatWindow } from '../chat/ChatWindow'
import { useChat } from '@/logic/hooks/useChat'
import { cn } from '@/logic/utils'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

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
            <div className="flex h-screen-safe w-full items-center justify-center bg-app-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        )
    }

    if (!currentUser) return null

    return (
        <div className="flex h-screen-safe w-full overflow-hidden bg-app-background pt-safe pb-safe relative">
            <AnimatePresence mode="wait" initial={false}>
                {/* Sidebar - Visible on desktop, or on mobile when no chat is active */}
                {(!activeRoomId || typeof window !== 'undefined' && window.innerWidth >= 768) && (
                    <motion.div
                        key="sidebar"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn(
                            "w-full md:w-auto md:flex-none h-full z-10",
                            activeRoomId ? "hidden md:block" : "block transition-all"
                        )}
                    >
                        <Sidebar />
                    </motion.div>
                )}

                {/* Main Chat Area - Visible on desktop, or on mobile when chat IS active */}
                {(activeRoomId || typeof window !== 'undefined' && window.innerWidth >= 768) && (
                    <motion.div
                        key="chat"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn(
                            "flex-1 min-w-0 h-full z-20",
                            activeRoomId ? "flex" : "hidden md:flex"
                        )}
                    >
                        <ChatWindow />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
