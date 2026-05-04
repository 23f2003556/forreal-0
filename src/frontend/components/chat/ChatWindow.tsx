"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Sparkles, Send, Paperclip, MessageSquare, Lock } from 'lucide-react'
import { Virtuoso } from 'react-virtuoso'
import { MessageBubble } from './MessageBubble'
import { useChat } from '@/logic/hooks/useChat'
import { format } from 'date-fns'
import { CoachPanel } from './CoachPanel'

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
        const fakeUrl = URL.createObjectURL(file)
        await sendMessage(fakeUrl, 'image')
    }

    const [isCoachOpen, setIsCoachOpen] = useState(false)
    const { roomModes, setRoomMode } = useChat()

    const coachMode = activeRoomId ? roomModes[activeRoomId] || null : null

    const [coachInsights, setCoachInsights] = useState<any>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisError, setAnalysisError] = useState<string | null>(null)

    const handleAnalyze = async (selectedMode?: 'work' | 'chill' | 'love', userPrompt?: string, style?: string) => {
        const modeToUse = selectedMode || coachMode
        if (!activeRoom || messages.length === 0 || !modeToUse) return

        setIsAnalyzing(true)
        setAnalysisError(null)
        try {
            const filteredMessages = messages.slice(-100)
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
                    userPrompt: userPrompt,
                    style,
                    timeWindow: 'realtime'
                })
            })

            const data = await response.json()
            if (!response.ok || data.error) throw new Error(data.error || 'Failed to analyze chat')
            setCoachInsights(data)
        } catch (error: any) {
            console.error('Analysis failed:', error)
            setAnalysisError(error.message || 'Failed to analyze chat')
        } finally {
            setIsAnalyzing(false)
        }
    }

    useEffect(() => {
        if (isCoachOpen && messages.length > 0) {
            const lastMsg = messages[messages.length - 1]
            if (lastMsg.sender_id !== currentUser?.id || !coachInsights) {
                handleAnalyze()
            }
        }
    }, [isCoachOpen, messages.length])

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
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', background: '#0a0710', color: '#fff' }}>
                <div style={{ textAlign: 'center', maxWidth: 400 }}>
                    <MessageSquare size={40} color="#a371ff" style={{ margin: '0 auto 20px' }} />
                    <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>ForReal Web</h1>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15 }}>Select a chat from the sidebar or start a new conversation to begin messaging.</p>
                </div>
            </div>
        )
    }

    const handleMessageAction = (id: string, action: string, data?: any) => {
        if (action === 'delete') deleteMessage(id)
        else if (action === 'react') reactToMessage(id, data)
        else if (action === 'reply') {
            const msg = messages.find(m => m.id === id)
            if (msg) setReplyingTo(msg)
        }
    }

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%', background: '#0a0710', color: '#fff', fontFamily: '"Inter", system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, height: '100%' }}>
                
                {/* Header */}
                <header style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <button onClick={() => setActiveRoomId(null)} className="md:hidden" style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    {activeRoom ? (
                        <>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#5fe49a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0710', fontWeight: 600, fontSize: 12 }}>
                                {activeRoom.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div style={{ fontWeight: 600, fontSize: 15 }}>{activeRoom.name}</div>
                        </>
                    ) : (
                        <div style={{ width: 100, height: 20, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                    )}
                    <span style={{ flex: 1 }} />
                    <button onClick={() => setIsCoachOpen(!isCoachOpen)} style={{ background: isCoachOpen ? 'rgba(163,113,255,0.12)' : 'transparent', border: isCoachOpen ? '1px solid rgba(163,113,255,0.35)' : '1px solid rgba(255,255,255,0.06)', color: isCoachOpen ? '#fff' : 'rgba(255,255,255,0.65)', padding: '6px 14px', fontSize: 12.5, borderRadius: 7, cursor: 'pointer' }}>
                        Insights
                    </button>
                </header>

                {/* Read Strip */}
                {coachInsights?.vibe && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 24px', background: 'linear-gradient(90deg, rgba(163,113,255,0.10), rgba(255,107,181,0.04) 50%, transparent)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13 }}>
                        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', color: '#c9a3ff' }}>READ</span>
                        <span style={{ width: 1, height: 12, background: 'rgba(163,113,255,0.3)' }} />
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <span style={{ color: '#ff8fc2', fontStyle: 'italic', fontFamily: '"Instrument Serif", serif', fontSize: 17 }}>{coachInsights.vibe}</span>
                            {coachInsights.summary?.[0] && (
                                <>
                                    <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11 }}>→</span>
                                    <span style={{ color: 'rgba(255,255,255,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{coachInsights.summary[0]}</span>
                                </>
                            )}
                        </span>
                    </div>
                )}

                {/* Messages Area */}
                <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 16px', height: '100%' }}>
                        <Virtuoso
                            style={{ height: '100%' }}
                            data={messages}
                            initialTopMostItemIndex={messages.length - 1}
                            followOutput="smooth"
                            className="custom-scrollbar"
                            itemContent={(index, msg) => (
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
                            )}
                        />
                    </div>
                </div>

                {/* Composer */}
                <div style={{ padding: '10px 24px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0a0710' }}>
                    {replyingTo && (
                        <div style={{ maxWidth: 720, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '2px solid #a371ff', paddingLeft: 8 }}>
                                <span style={{ color: '#a371ff', fontSize: 10 }}>Replying to {activeRoom?.name}</span>
                                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{replyingTo.content}</span>
                            </div>
                            <button onClick={() => setReplyingTo(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.42)', cursor: 'pointer' }}>×</button>
                        </div>
                    )}

                    <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 6, maxWidth: 720, margin: '0 auto' }}>
                        <button type="button" onClick={() => fileInputRef.current?.click()} style={{ width: 32, height: 32, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.42)', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}>+</button>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
                        
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => { setNewMessage(e.target.value); sendTyping(); }}
                            placeholder="Message..."
                            style={{ flex: 1, padding: '8px 4px', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, minWidth: 0, fontFamily: 'inherit' }}
                        />
                        
                        <button type="submit" disabled={!newMessage.trim()} style={{ width: 36, height: 36, background: newMessage.trim() ? 'linear-gradient(135deg,#a371ff,#ff6bb5)' : 'rgba(255,255,255,0.06)', border: 'none', color: newMessage.trim() ? '#fff' : 'rgba(255,255,255,0.42)', borderRadius: 10, fontSize: 16, cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s, color 0.15s' }}>↑</button>
                    </form>
                </div>
            </div>

            <CoachPanel
                isOpen={isCoachOpen}
                onClose={() => setIsCoachOpen(false)}
                loading={isAnalyzing}
                error={analysisError}
                insights={coachInsights}
                onSuggestionClick={(text) => { setNewMessage(text); }}
                onRefresh={(prompt, style) => handleAnalyze(undefined, prompt, style)}
                mode={coachMode}
                onModeChange={(mode) => { if (activeRoomId) setRoomMode(activeRoomId, mode); if (mode) handleAnalyze(mode); }}
            />
        </div>
    )
}
