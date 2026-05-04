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
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                width: '100%', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: '#0a0710', 
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Ambient Glow */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(163,113,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                
                <div style={{ textAlign: 'center', maxWidth: 420, position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 80, height: 80, borderRadius: '24px', background: 'linear-gradient(135deg, #a371ff, #ff6bb5)', margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(163,113,255,0.2)' }}>
                         <MessageSquare size={32} color="#fff" style={{ margin: 'auto' }} />
                    </div>
                    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.03em' }}>Forreal Web</h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, lineHeight: 1.6 }}>
                        The future of communication is here.<br />
                        Select a conversation to start interpreting intent.
                    </p>
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
                <header style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12, 
                    padding: '16px 24px', 
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: 'rgba(10, 7, 16, 0.85)',
                    backdropFilter: 'blur(20px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 30
                }}>
                    <button onClick={() => setActiveRoomId(null)} className="md:hidden" style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    {activeRoom ? (
                        <>
                            <div style={{ width: 34, height: 34, borderRadius: '12px', background: 'linear-gradient(135deg, #a371ff, #7c4ddb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(163,113,255,0.2)' }}>
                                {activeRoom.name.substring(0, 1).toUpperCase()}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>{activeRoom.name}</div>
                                <div style={{ fontSize: 10, color: '#5fe49a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Now</div>
                            </div>
                        </>
                    ) : (
                        <div style={{ width: 100, height: 20, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                    )}
                    <span style={{ flex: 1 }} />
                    <button 
                        onClick={() => setIsCoachOpen(!isCoachOpen)} 
                        style={{ 
                            background: isCoachOpen ? 'rgba(163,113,255,0.12)' : 'rgba(255,255,255,0.03)', 
                            border: '1px solid rgba(255,255,255,0.06)', 
                            color: isCoachOpen ? '#a371ff' : 'rgba(255,255,255,0.65)', 
                            padding: '7px 16px', 
                            fontSize: 12, 
                            fontWeight: 600,
                            borderRadius: 9, 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Insights
                    </button>
                </header>

                {/* Read Strip */}
                {coachInsights?.vibe && (
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 12, 
                        padding: '12px 24px', 
                        background: 'linear-gradient(90deg, rgba(163,113,255,0.12), rgba(255,107,181,0.06) 50%, transparent)', 
                        borderBottom: '1px solid rgba(255,255,255,0.04)', 
                        fontSize: 13 
                    }}>
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', color: '#a371ff' }}>READ</span>
                        <span style={{ width: 1, height: 12, background: 'rgba(163,113,255,0.2)' }} />
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <span style={{ color: '#ff8fc2', fontStyle: 'italic', fontFamily: 'serif', fontSize: 18 }}>{coachInsights.vibe}</span>
                            {coachInsights.summary?.[0] && (
                                <>
                                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>—</span>
                                    <span style={{ color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{coachInsights.summary[0]}</span>
                                </>
                            )}
                        </span>
                    </div>
                )}

                {/* Messages Area */}
                <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: '#0a0710' }}>
                    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px 16px', height: '100%' }}>
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
                <div style={{ padding: '12px 24px 24px', background: '#0a0710', position: 'relative' }}>
                    {/* Gradient Fade Top */}
                    <div style={{ position: 'absolute', top: -40, left: 0, right: 0, height: 40, background: 'linear-gradient(to top, #0a0710, transparent)', pointerEvents: 'none' }} />
                    
                    {replyingTo && (
                        <div style={{ maxWidth: 760, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '2px solid #a371ff', paddingLeft: 12 }}>
                                <span style={{ color: '#a371ff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Replying to {activeRoom?.name}</span>
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>{replyingTo.content}</span>
                            </div>
                            <button onClick={() => setReplyingTo(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 20, cursor: 'pointer', padding: 4 }}>×</button>
                        </div>
                    )}

                    <form onSubmit={handleSend} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 12, 
                        background: 'rgba(255,255,255,0.04)', 
                        border: '1px solid rgba(255,255,255,0.06)', 
                        borderRadius: 20, 
                        padding: '8px 10px', 
                        maxWidth: 760, 
                        margin: '0 auto',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <button type="button" onClick={() => fileInputRef.current?.click()} style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.5)', borderRadius: 14, fontSize: 20, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>+</button>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
                        
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => { setNewMessage(e.target.value); sendTyping(); }}
                            placeholder="Message..."
                            style={{ flex: 1, padding: '10px 4px', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 15, minWidth: 0, fontFamily: 'inherit' }}
                        />
                        
                        <button 
                            type="submit" 
                            disabled={!newMessage.trim()} 
                            style={{ 
                                width: 40, 
                                height: 40, 
                                background: newMessage.trim() ? 'linear-gradient(135deg, #a371ff, #7c4ddb)' : 'rgba(255,255,255,0.04)', 
                                border: 'none', 
                                color: newMessage.trim() ? '#fff' : 'rgba(255,255,255,0.2)', 
                                borderRadius: 14, 
                                fontSize: 18, 
                                cursor: newMessage.trim() ? 'pointer' : 'default', 
                                flexShrink: 0, 
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: newMessage.trim() ? '0 8px 20px rgba(163,113,255,0.3)' : 'none'
                            }}
                        >
                            ↑
                        </button>
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
