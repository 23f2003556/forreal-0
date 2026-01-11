"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Sparkles, Send, Paperclip, Mic } from 'lucide-react'
import { Virtuoso } from 'react-virtuoso'
import { MessageBubble } from './MessageBubble'
import { useChat } from '@/hooks/useChat'
import { format } from 'date-fns'
import { CoachPanel } from './CoachPanel'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function ChatWindow() {
    const { activeRoomId, messages, currentUser, sendMessage, rooms, sendTyping, setActiveRoomId } = useChat()
    const [newMessage, setNewMessage] = useState('')
    const [isRecording, setIsRecording] = useState(false)
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

    const handleVoiceNote = async () => {
        if (!isRecording) {
            setIsRecording(true)
        } else {
            setIsRecording(false)
            // Send dummy voice note
            await sendMessage('dummy-audio-url', 'audio')
        }
    }

    const [isCoachOpen, setIsCoachOpen] = useState(false)
    const [coachMode, setCoachMode] = useState<'work' | 'chill' | 'love' | null>(null)
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

    const handleAnalyze = async (selectedMode?: 'work' | 'chill' | 'love', userPrompt?: string, style?: string) => {
        const modeToUse = selectedMode || coachMode
        if (!activeRoom || messages.length === 0 || !modeToUse) return

        setIsAnalyzing(true)
        setAnalysisError(null)
        try {
            // Get last 10 messages
            const recentMessages = messages.slice(-10).map(m => ({
                role: m.sender_id === currentUser?.id ? 'user' : 'partner',
                content: m.content
            }))

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: recentMessages,
                    partnerName: activeRoom.name,
                    mode: modeToUse,
                    userPrompt,
                    style
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
            <div className="flex flex-col h-full bg-app-background w-full items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary mb-3">ForReal Web</h1>
                    <p className="text-text-secondary text-base leading-relaxed">
                        Send and receive messages without keeping your phone online.<br />
                        Experience the new modern interface.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full w-full relative bg-app-background">
            <div className="flex flex-col h-full flex-1 relative min-w-0">

                {/* Header - Glassmorphism */}
                <div className="absolute top-0 left-0 right-0 h-[70px] z-20 px-4 flex justify-between items-center backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-gray-200/50 dark:border-gray-800/50">
                    <div className="flex items-center gap-4 cursor-pointer">
                        <button
                            onClick={() => setActiveRoomId(null)}
                            className="md:hidden text-icon-gray hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow-sm">
                                <img src={activeRoom?.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${activeRoom?.name}`} alt="Contact Avatar" className="w-full h-full object-cover" />
                            </div>
                            {activeRoom?.is_online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black"></div>
                            )}
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="font-semibold text-text-primary text-base tracking-tight">
                                {activeRoom ? activeRoom.name : 'Loading...'}
                            </h2>
                            <p className="text-xs text-text-secondary font-medium">
                                {activeRoom?.is_online ? 'Active now' : activeRoom?.last_seen ? `Last seen ${format(new Date(activeRoom.last_seen), 'PP p')}` : ''}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
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
                <div className="flex-1 z-10 min-h-0 pt-[70px] pb-[80px]">
                    <Virtuoso
                        style={{ height: '100%' }}
                        data={messages}
                        initialTopMostItemIndex={messages.length - 1}
                        followOutput="smooth"
                        className="custom-scrollbar px-2"
                        itemContent={(index, msg) => (
                            <div className="px-2 py-1 max-w-3xl mx-auto w-full">
                                <MessageBubble
                                    key={msg.id}
                                    content={msg.content}
                                    time={format(new Date(msg.created_at), 'HH:mm')}
                                    isOutgoing={msg.sender_id === currentUser?.id}
                                    status={msg.status}
                                    type={msg.type}
                                />
                            </div>
                        )}
                    />
                </div>

                {/* Floating Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-app-background via-app-background to-transparent pb-6">
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

                            <button
                                type="button"
                                onClick={handleVoiceNote}
                                className={cn(
                                    "transition-colors",
                                    isRecording ? "text-red-500 animate-pulse" : "text-icon-gray hover:text-primary"
                                )}
                            >
                                <Mic className="w-5 h-5" />
                            </button>
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
                            setCoachMode(mode)
                            if (mode) {
                                handleAnalyze(mode)
                            }
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

