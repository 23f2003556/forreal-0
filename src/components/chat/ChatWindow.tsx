"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Sparkles, Send } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { useChat } from '@/hooks/useChat'
import { format } from 'date-fns'
import { CoachPanel } from './CoachPanel'
import { cn } from '@/lib/utils'

export function ChatWindow() {
    const { activeRoomId, messages, currentUser, sendMessage, rooms, sendTyping, setActiveRoomId } = useChat()
    const [newMessage, setNewMessage] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const activeRoom = rooms.find(r => r.id === activeRoomId)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

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
            <div className="flex flex-col h-full bg-app-background w-full items-center justify-center border-b-[6px] border-teal-primary">
                <div className="text-center max-w-md px-4">
                    <h1 className="text-3xl font-light text-gray-600 mb-4">ForReal Web</h1>
                    <p className="text-gray-500 text-sm">
                        Send and receive messages without keeping your phone online.<br />
                        Use ForReal on up to 4 linked devices and 1 phone.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full w-full relative">
            <div className="flex flex-col h-full bg-chat-background flex-1 relative min-w-0">
                {/* Doodle Background Pattern */}
                <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"></div>

                {/* Header */}
                <div className="px-4 py-2 bg-panel-header-background flex justify-between items-center h-[60px] z-10 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4 cursor-pointer">
                        <button
                            onClick={() => setActiveRoomId(null)}
                            className="md:hidden text-icon-gray mr-2"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                            <img src={activeRoom?.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${activeRoom?.name}`} alt="Contact Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="font-semibold text-text-primary text-sm">
                                {activeRoom ? activeRoom.name : 'Loading...'}
                            </h2>
                            <p className="text-xs text-text-secondary">
                                {activeRoom?.is_online ? 'online' : activeRoom?.last_seen ? `last seen ${format(new Date(activeRoom.last_seen), 'PP p')}` : ''}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 text-icon-gray">
                        <button
                            onClick={() => setIsCoachOpen(!isCoachOpen)}
                            className={cn("transition-colors", isCoachOpen ? "text-purple-600" : "hover:text-purple-600")}
                            title="ForReal AI"
                        >
                            <Sparkles className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 z-10 custom-scrollbar flex flex-col gap-2">
                    {messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            content={msg.content}
                            time={format(new Date(msg.created_at), 'HH:mm')}
                            isOutgoing={msg.sender_id === currentUser?.id}
                            status={msg.status}
                            type={msg.type}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="px-4 py-2 bg-panel-header-background z-10 flex items-center gap-2 min-h-[62px]">
                    <div className="flex-1 bg-white dark:bg-gray-700 rounded-lg px-4 py-2 mx-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value)
                                // Debounce typing indicator could be added here
                                sendTyping()
                            }}
                            placeholder="Type a message"
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-text-primary placeholder:text-text-secondary"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsCoachOpen(!isCoachOpen)}
                        className={cn("text-icon-gray hover:text-purple-600 transition-colors", isCoachOpen && "text-purple-600")}
                    >
                        <Sparkles className="w-6 h-6" />
                    </button>
                    <button type="submit" className="text-icon-gray"><Send className="w-6 h-6" /></button>
                </form>
            </div>

            {/* Coach Panel */}
            <CoachPanel
                isOpen={isCoachOpen}
                onClose={() => setIsCoachOpen(false)}
                loading={isAnalyzing}
                error={analysisError}
                insights={coachInsights}
                onSuggestionClick={(text) => {
                    setNewMessage(text)
                    // Auto-close on mobile for better UX
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
        </div>
    )
}
