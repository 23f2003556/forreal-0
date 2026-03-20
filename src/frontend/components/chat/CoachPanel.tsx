"use client"

import React from 'react'
import { Sparkles, Zap, MessageCircle, RefreshCw, ArrowLeft, Heart, Briefcase, Coffee, AlertTriangle, CheckCircle, Snowflake } from 'lucide-react'
import { cn } from '@/logic/utils'
import { motion, AnimatePresence } from 'framer-motion'

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
        redFlags?: string[]
        greenFlags?: string[]
        icebreaker?: string
    } | null
    onSuggestionClick: (text: string) => void
    onRefresh: (prompt?: string, style?: string) => void
    mode: 'work' | 'chill' | 'love' | null
    onModeChange: (mode: 'work' | 'chill' | 'love' | null) => void
}

export function CoachPanel({
    isOpen, onClose, loading, error, insights, onSuggestionClick, onRefresh, mode, onModeChange
}: CoachPanelProps) {
    const modes = [
        { id: 'work', label: 'Work', icon: Briefcase, color: 'text-blue-500', gradient: 'from-blue-500/10 to-cyan-500/10', border: 'hover:border-blue-500/50', desc: 'Professional & Efficient' },
        { id: 'chill', label: 'Chill', icon: Coffee, color: 'text-amber-600', gradient: 'from-amber-500/10 to-orange-500/10', border: 'hover:border-amber-500/50', desc: 'Casual & Friendly' },
        { id: 'love', label: 'Love', icon: Heart, color: 'text-pink-500', gradient: 'from-pink-500/10 to-rose-500/10', border: 'hover:border-pink-500/50', desc: 'Romantic & Deep' },
    ] as const

    const [customPrompt, setCustomPrompt] = React.useState('')

    const handleAskAI = (e: React.FormEvent) => {
        e.preventDefault()
        if (!customPrompt.trim()) return
        onRefresh(customPrompt)
        setCustomPrompt('')
    }

    const panelVariants = {
        hidden: { x: '100%', opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 30
            }
        },
        exit: {
            x: '100%',
            opacity: 0,
            transition: {
                duration: 0.2,
                ease: "easeInOut" as const
            }
        }
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            className="fixed inset-y-0 right-0 w-full md:w-[320px] bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-l border-white/20 dark:border-white/10 shadow-2xl z-50 flex flex-col h-full"
        >
            <AnimatePresence mode='wait'>
                {!mode ? (
                    <motion.div
                        key="mode-selection"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="absolute inset-0 z-20 bg-white/95 dark:bg-gray-950/95 flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">ForReal AI</h2>
                                    <p className="text-xs text-gray-500 font-medium">Friend Engine</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 p-6 flex flex-col gap-4 justify-center">
                            <h3 className="text-center font-medium text-gray-500 dark:text-gray-400 mb-2">How should I help you?</h3>
                            <div className="flex flex-col gap-3">
                                {modes.map((m) => {
                                    const Icon = m.icon
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => onModeChange(m.id)}
                                            className={cn(
                                                "relative overflow-hidden flex items-center p-4 rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300 group text-left",
                                                m.border
                                            )}
                                        >
                                            <div className={cn("absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity", m.gradient)} />
                                            <div className={cn("p-3 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-900 transition-colors mr-4", m.color)}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="relative z-10">
                                                <span className="block font-bold text-gray-800 dark:text-gray-100 group-hover:translate-x-1 transition-transform">{m.label}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{m.desc}</span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="dashboard"
                        className="flex flex-col h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", modes.find(m => m.id === mode)?.color)}>
                                        {(() => {
                                            const Icon = modes.find(m => m.id === mode)?.icon || Sparkles
                                            return <Icon className="w-5 h-5" />
                                        })()}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900 dark:text-white leading-none">{modes.find(m => m.id === mode)?.label} Mode</h2>
                                        <button
                                            onClick={() => onModeChange(null)}
                                            className="text-xs text-gray-500 hover:text-purple-600 transition-colors mt-1"
                                        >
                                            Change Mode
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => onRefresh()}
                                        className={cn(
                                            "p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all",
                                            loading && "animate-spin text-purple-600"
                                        )}
                                        disabled={loading}
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>



                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7 custom-scrollbar pb-[calc(100px+env(safe-area-inset-bottom))]">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-sm text-red-600 dark:text-red-400 flex items-center gap-3 shadow-sm"
                                >
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                                    <span className="font-medium">{error}</span>
                                </motion.div>
                            )}





                            {/* Vibe Check */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/50 dark:to-gray-900/30 rounded-[28px] p-6 shadow-sm border border-gray-100 dark:border-gray-800/60"
                            >
                                <div className="flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    <MessageCircle className="w-4 h-4" />
                                    Vibe Check
                                </div>
                                <div className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-relaxed">
                                    {insights?.vibe ? (
                                        <>
                                            "{insights.vibe}"
                                        </>
                                    ) : (
                                        <span className="text-gray-400 italic text-base font-medium">Listening for vibes...</span>
                                    )}
                                </div>
                            </motion.div>

                            {/* Summary */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-gray-900/50 rounded-[28px] p-6 shadow-sm border border-gray-100 dark:border-gray-800/60"
                            >
                                <div className="flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    <Sparkles className="w-4 h-4" />
                                    Coach Insights
                                </div>
                                <ul className="space-y-4">
                                    {insights?.summary ? (
                                        insights.summary.map((item, idx) => (
                                            <li key={idx} className="text-sm sm:text-[15px] font-medium text-gray-700 dark:text-gray-300 flex items-start gap-4">
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-[15px] text-gray-400 italic font-medium">Crunching the data...</li>
                                    )}
                                </ul>
                            </motion.div>

                            {/* Suggestions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="space-y-5"
                            >
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest px-1">
                                    <Zap className="w-4 h-4" />
                                    Suggested Replies
                                </div>

                                <div className="space-y-3">
                                    {insights?.suggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => onSuggestionClick(suggestion)}
                                            className="w-full text-left p-5 bg-white dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-700/60 hover:border-purple-200 dark:hover:border-purple-700/60 rounded-[22px] text-[15px] font-semibold text-gray-800 dark:text-gray-200 transition-all duration-200 group shadow-sm hover:shadow-md active:scale-[0.99]"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600 dark:group-hover:bg-purple-900/50 dark:group-hover:text-purple-300 transition-colors shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <span className="flex-1 leading-snug">{suggestion}</span>
                                                <ArrowLeft className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all text-purple-500 rotate-180 shrink-0" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="pt-2"
                            >
                                <form onSubmit={handleAskAI} className="relative group">
                                    <input
                                        type="text"
                                        value={customPrompt}
                                        onChange={(e) => setCustomPrompt(e.target.value)}
                                        placeholder="Tell AI what to say..."
                                        className="w-full p-4 pr-12 text-sm bg-gray-50 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all shadow-inner"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !customPrompt.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 text-purple-600 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
