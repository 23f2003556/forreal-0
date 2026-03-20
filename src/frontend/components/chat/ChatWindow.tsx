"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Sparkles, Send, Paperclip, MessageSquare, Lock } from 'lucide-react'
import { Virtuoso } from 'react-virtuoso'
import { MessageBubble } from './MessageBubble'
import { useChat } from '@/logic/hooks/useChat'
import { format } from 'date-fns'
import { CoachPanel } from './CoachPanel'
import { cn } from '@/logic/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function ChatWindow() {
    const { activeRoomId, messages, currentUser, sendMessage, rooms, sendTyping, setActiveRoomId, deleteMessage, reactToMessage } = useChat()
    const [newMessage, setNewMessage] = useState('')
    const [replyingTo, setReplyingTo] = useState<any | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const activeRoom = rooms.find(r => r.id === activeRoomId)

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        await sendMessage(newMessage)
        setNewMessage('')
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !currentUser) return

        // In a real app, upload to Supabase Storage here
        // const { data, error } = await supabase.storage.from('media').upload(...)

        // For MVP demo, we'll use a fake URL or object URL
        const fakeUrl = URL.createObjectURL(file)
        await sendMessage(fakeUrl, 'image')
    }



    const [isCoachOpen, setIsCoachOpen] = useState(false)
    const { roomModes, setRoomMode, unreadCounts } = useChat()
    const [selectedDate, setSelectedDate] = useState('')

    // Get current mode for this room
    const coachMode = activeRoomId ? roomModes[activeRoomId] || null : null

    const [coachInsights, setCoachInsights] = useState<{
        interestScore: number
        vibe: string
        summary: string[]
        suggestions: string[]
        redFlags?: string[]
        greenFlags?: string[]
        icebreaker?: string
    } | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisError, setAnalysisError] = useState<string | null>(null)
    const [timeWindow, setTimeWindow] = useState<'realtime' | 'week' | 'month' | 'date'>('realtime')

    const handleAnalyze = async (selectedMode?: 'work' | 'chill' | 'love', userPrompt?: string, style?: string) => {
        const modeToUse = selectedMode || coachMode
        if (!activeRoom || messages.length === 0 || !modeToUse) return

        setIsAnalyzing(true)
        setAnalysisError(null)
        try {
            // Determine message scope based on timeWindow
            let filteredMessages = [...messages]
            const now = new Date()

            if (timeWindow === 'realtime') {
                filteredMessages = messages.slice(-15)
            } else if (timeWindow === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                filteredMessages = messages.filter(m => new Date(m.created_at) > weekAgo)
            } else if (timeWindow === 'month') {
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                filteredMessages = messages.filter(m => new Date(m.created_at) > monthAgo)
            } else if (timeWindow === 'date' && selectedDate) {
                const targetDate = new Date(selectedDate)
                filteredMessages = messages.filter(m => {
                    const msgDate = new Date(m.created_at)
                    return msgDate.toDateString() === targetDate.toDateString()
                })
            }

            const recentMessages = filteredMessages.map(m => ({
                role: m.sender_id === currentUser?.id ? 'user' : 'partner',
                content: m.content,
                timestamp: m.created_at
            }))

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: recentMessages,
                    partnerName: activeRoom.name,
                    userName: currentUser?.username || 'the user',
                    mode: modeToUse,
                    userPrompt: userPrompt, // Now only passed if explicitly provided (e.g. from a custom manual ask)
                    style,
                    timeWindow
                })
            })

            let data
            try {
                data = await response.json()
            } catch (e) {
                throw new Error(`Server error (${response.status}): Unable to parse response`)
            }

            if (!response.ok || data.error) throw new Error(data.error || 'Failed to analyze chat')

            setCoachInsights(data)
        } catch (error: any) {
            console.error('Analysis failed:', error)
            setAnalysisError(error.message || 'Failed to analyze chat')
        } finally {
            setIsAnalyzing(false)
        }
    }

    // Auto-analyze when opening panel or receiving new partner message
    useEffect(() => {
        if (isCoachOpen && messages.length > 0) {
            const lastMsg = messages[messages.length - 1]
            // Analyze if last message is from partner or if we haven't analyzed yet
            if (lastMsg.sender_id !== currentUser?.id || !coachInsights) {
                handleAnalyze()
            }
        }
    }, [isCoachOpen, messages.length]) // Simple dependency on length change

    // Keyboard shortcut Cmd+K to toggle AI panel
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsCoachOpen(prev => !prev)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    if (!activeRoomId) {
        return (
            <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0a0f1d] w-full items-center justify-center relative overflow-hidden">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} 
                />
                
                <div className="text-center max-w-md px-6 relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white dark:bg-gray-900/60 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800/60 flex items-center justify-center mb-8 ring-[8px] ring-gray-50 dark:ring-[#0a0f1d]">
                        <MessageSquare className="w-10 h-10 text-purple-500/80" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-[22px] font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-2.5">ForReal Web</h1>
                    <p className="text-gray-500 dark:text-gray-400/80 text-[15px] leading-relaxed max-w-[280px] mx-auto mb-8 font-medium">
                        Select a chat from the sidebar or start a new conversation to begin messaging.
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-wide text-gray-400 dark:text-gray-600 uppercase">
                        <Lock className="w-3.5 h-3.5" />
                        <span>End-to-End Encrypted</span>
                    </div>
                </div>
            </div>
        )
    }

    const handleMessageAction = (id: string, action: string, data?: any) => {
        if (action === 'delete') {
            deleteMessage(id)
        } else if (action === 'react') {
            reactToMessage(id, data) // data is emoji
        } else if (action === 'reply') {
            const msg = messages.find(m => m.id === id)
            if (msg) setReplyingTo(msg)
        }
    }

    return (
        <div className="flex h-full w-full relative bg-app-background">
            <div className="flex flex-col h-full flex-1 relative min-w-0">

                {/* Header - Glassmorphism */}
                <div className="absolute top-0 left-0 right-0 h-[64px] sm:h-[70px] z-20 px-3 sm:px-4 flex justify-between items-center backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-gray-200/50 dark:border-gray-800/50 pt-[env(safe-area-inset-top)] box-content">
                    <div className="flex items-center gap-3 sm:gap-4 cursor-pointer">
                        <button
                            onClick={() => setActiveRoomId(null)}
                            className="md:hidden text-icon-gray hover:text-primary transition-colors p-1"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="relative">
                            {activeRoom ? (
                                <>
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow-sm">
                                        <img src={activeRoom.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${activeRoom.name}`} alt="Contact Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    {activeRoom.is_online && (
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-black"></div>
                                    )}
                                </>
                            ) : (
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                            )}
                        </div>
                        <div className="flex flex-col justify-center max-w-[150px] sm:max-w-none">
                            {activeRoom ? (
                                <>
                                    <h2 className="font-semibold text-text-primary text-sm sm:text-base tracking-tight truncate">
                                        {activeRoom.name}
                                    </h2>
                                    <p className="text-[10px] sm:text-xs text-text-secondary font-medium">
                                        {activeRoom.is_online ? 'Active now' : ''}
                                    </p>
                                </>
                            ) : (
                                <div className="h-4 w-24 sm:h-5 sm:w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                            )}
                        </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                        <button
                            onClick={() => setIsCoachOpen(!isCoachOpen)}
                            className={cn(
                                "p-2 rounded-full transition-all duration-300",
                                isCoachOpen
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-icon-gray"
                            )}
                            title="ForReal AI"
                        >
                            <Sparkles className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 z-10 min-h-0 pt-[calc(64px+env(safe-area-inset-top))] pb-[calc(80px+env(safe-area-inset-bottom))]">
                    <Virtuoso
                        style={{ height: '100%' }}
                        data={messages}
                        initialTopMostItemIndex={messages.length - 1}
                        followOutput="smooth"
                        className="custom-scrollbar px-2 pt-4"
                        itemContent={(index, msg) => {
                            if (msg.type === 'audio') return null;
                            return (
                                <div className="px-2 py-1 max-w-3xl mx-auto w-full">
                                    <MessageBubble
                                        key={msg.id}
                                        id={msg.id}
                                        content={msg.content}
                                        time={format(new Date(msg.created_at), 'HH:mm')}
                                        isOutgoing={msg.sender_id === currentUser?.id}
                                        status={msg.status}
                                        type={msg.type}
                                        reactions={msg.reactions}
                                        onAction={handleMessageAction}
                                    />
                                </div>
                            )
                        }}
                    />
                </div>

                {/* Floating Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20 bg-gradient-to-t from-app-background via-app-background to-transparent pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                    {replyingTo && (
                        <div className="max-w-3xl mx-auto mb-2 flex items-center justify-between bg-gray-50 dark:bg-gray-800/80 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col text-sm border-l-2 border-primary pl-2">
                                <span className="text-primary font-medium text-[10px] sm:text-xs">Replying to {activeRoom?.name}</span>
                                <span className="text-text-secondary text-xs truncate max-w-[200px] sm:max-w-xs">{replyingTo.content}</span>
                            </div>
                            <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                                <span className="sr-only">Cancel reply</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-center gap-2">
                        <div className="flex-1 bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 px-4 py-3 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
                            <button
                                type="button"
                                className="text-icon-gray hover:text-primary transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Paperclip className="w-5 h-5" />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                />
                            </button>

                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value)
                                    sendTyping()
                                }}
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-text-primary placeholder:text-text-secondary font-medium"
                            />


                        </div>

                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95",
                                newMessage.trim()
                                    ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-primary/30"
                                    : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            <Send className="w-5 h-5 ml-0.5" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Coach Panel */}
            <AnimatePresence>
                {isCoachOpen && (
                    <CoachPanel
                        isOpen={isCoachOpen}
                        onClose={() => setIsCoachOpen(false)}
                        loading={isAnalyzing}
                        error={analysisError}
                        insights={coachInsights}
                        onSuggestionClick={(text) => {
                            setNewMessage(text)
                            if (window.innerWidth < 768) {
                                setIsCoachOpen(false)
                            }
                        }}
                        onRefresh={(prompt, style) => {
                            if (typeof prompt === 'string') {
                                handleAnalyze(undefined, prompt, style)
                            } else {
                                handleAnalyze(undefined, undefined, style)
                            }
                        }}
                        mode={coachMode}
                        onModeChange={(mode) => {
                            if (activeRoomId) {
                                setRoomMode(activeRoomId, mode)
                            }
                            if (mode) {
                                handleAnalyze(mode)
                            }
                        }}
                        timeWindow={timeWindow}
                        onTimeWindowChange={(window) => {
                            setTimeWindow(window)
                            // Re-analyze when time window changes
                            handleAnalyze(undefined, undefined, undefined)
                        }}

                        selectedDate={selectedDate}
                        onDateChange={(date) => {
                            setSelectedDate(date)
                            if (timeWindow === 'date') {
                                handleAnalyze()
                            }
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

