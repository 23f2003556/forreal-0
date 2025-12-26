"use client"

import React from 'react'
import { Sparkles, Zap, MessageCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CoachPanelProps {
    isOpen: boolean
    onClose: () => void
    loading: boolean
    error: string | null
    insights: {
        interestScore: number
        vibe: string
        summary: string[]
        suggestions: string[]
    } | null
    onSuggestionClick: (text: string) => void
    onRefresh: (prompt?: string, style?: string) => void
    mode: 'work' | 'chill' | 'love' | null
    onModeChange: (mode: 'work' | 'chill' | 'love' | null) => void
}

export function CoachPanel({ isOpen, onClose, loading, error, insights, onSuggestionClick, onRefresh, mode, onModeChange }: CoachPanelProps) {
    if (!isOpen) return null

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500'
        if (score >= 50) return 'text-yellow-500'
        return 'text-red-500'
    }

    const modes = [
        { id: 'work', label: 'Work', icon: '💼', desc: 'Professional & Efficient' },
        { id: 'chill', label: 'Chill', icon: '☕', desc: 'Casual & Friendly' },
        { id: 'love', label: 'Love', icon: '❤️', desc: 'Romantic & Deep' },
    ] as const

    // Mode Selection Screen
    if (!mode) {
        return (
            <div className="fixed inset-0 md:relative md:w-[300px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-xl z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <Sparkles className="w-5 h-5" />
                        <h2 className="font-bold">ForReal</h2>
                    </div>
                    <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 p-1">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 p-4 flex flex-col gap-4 justify-center">
                    <h3 className="text-center font-medium text-gray-600 dark:text-gray-300">Select a Mode</h3>
                    {modes.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => onModeChange(m.id)}
                            className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                        >
                            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{m.icon}</span>
                            <span className="font-bold text-gray-800 dark:text-gray-200">{m.label}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{m.desc}</span>
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    const [customPrompt, setCustomPrompt] = React.useState('')
    const [selectedStyle, setSelectedStyle] = React.useState<string | null>(null)

    const modeStyles = {
        work: ['Concise', 'Formal', 'Action-oriented'],
        chill: ['Funny', 'Empathetic', 'Slang'],
        love: ['Flirty', 'Poetic', 'Supportive'],
    }

    const handleAskAI = (e: React.FormEvent) => {
        e.preventDefault()
        if (!customPrompt.trim()) return
        onRefresh(customPrompt, selectedStyle || undefined)
        setCustomPrompt('')
    }

    const handleStyleClick = (style: string) => {
        const newStyle = selectedStyle === style ? null : style
        setSelectedStyle(newStyle)
        onRefresh(undefined, newStyle || undefined)
    }

    return (
        <div className="fixed inset-0 md:relative md:w-[300px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-xl z-50">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col gap-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <span className="text-xl">{modes.find(m => m.id === mode)?.icon}</span>
                        <h2 className="font-bold">{modes.find(m => m.id === mode)?.label} Mode</h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                onModeChange(null)
                                setSelectedStyle(null)
                            }}
                            className="text-xs bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 px-2 py-1 rounded text-purple-700 dark:text-purple-300 transition-colors"
                        >
                            Change Mode
                        </button>
                        <button
                            onClick={() => onRefresh(undefined, selectedStyle || undefined)}
                            className={cn("text-gray-400 hover:text-purple-600 transition-colors", loading && "animate-spin")}
                            disabled={loading}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 ml-2">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Style Chips */}
                <div className="flex flex-wrap gap-2">
                    {mode && modeStyles[mode].map((style) => (
                        <button
                            key={style}
                            onClick={() => handleStyleClick(style)}
                            className={cn(
                                "text-[10px] px-2 py-1 rounded-full border transition-all",
                                selectedStyle === style
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "bg-white/50 dark:bg-black/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-purple-400"
                            )}
                        >
                            {style}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Interest Score - Hidden in Work Mode */}
                {mode !== 'work' && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-3 text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                            <Zap className="w-4 h-4" />
                            Interest Score
                        </div>
                        <div className="flex items-center justify-center relative h-32">
                            {/* Simple Circular Progress Placeholder */}
                            <svg className="w-28 h-28 transform -rotate-90">
                                <circle
                                    cx="56"
                                    cy="56"
                                    r="50"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-gray-200 dark:text-gray-700"
                                />
                                <circle
                                    cx="56"
                                    cy="56"
                                    r="50"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={314}
                                    strokeDashoffset={314 - (314 * (insights?.interestScore || 0)) / 100}
                                    className={cn("transition-all duration-1000 ease-out", getScoreColor(insights?.interestScore || 0))}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className={cn("text-3xl font-bold", getScoreColor(insights?.interestScore || 0))}>
                                    {insights?.interestScore || 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Vibe Check */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                        <MessageCircle className="w-4 h-4" />
                        Vibe Check
                    </div>
                    <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        {insights?.vibe || "Analyzing..."}
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        Key Takeaways
                    </div>
                    <ul className="space-y-2">
                        {insights?.summary ? (
                            insights.summary.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                                    {item}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-gray-400 italic">No summary available yet...</li>
                        )}
                    </ul>
                </div>

                {/* Interactive Suggest Reply */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        Suggest Reply
                    </div>

                    <form onSubmit={handleAskAI} className="space-y-2">
                        <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="e.g., 'Make it funny' or 'Ask for a meeting'"
                            className="w-full p-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-20"
                        />
                        <button
                            type="submit"
                            disabled={loading || !customPrompt.trim()}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            Ask AI
                        </button>
                    </form>

                    {/* AI Suggestions Display */}
                    <div className="space-y-2">
                        {insights?.suggestions.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSuggestionClick(suggestion)}
                                className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-100 dark:border-purple-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
