"use client"

import React from 'react'
import { Sparkles, Zap, MessageCircle, RefreshCw, ArrowLeft, Heart, Briefcase, Coffee, AlertTriangle, CheckCircle, Snowflake } from 'lucide-react'
import { cn } from '@/lib/utils'
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

export function CoachPanel({ isOpen, onClose, loading, error, insights, onSuggestionClick, onRefresh, mode, onModeChange }: CoachPanelProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500 from-emerald-500 to-teal-400'
        if (score >= 50) return 'text-amber-500 from-amber-500 to-orange-400'
        return 'text-rose-500 from-rose-500 to-red-600'
    }

    const modes = [
        { id: 'work', label: 'Work', icon: Briefcase, color: 'text-blue-500', gradient: 'from-blue-500/10 to-cyan-500/10', border: 'hover:border-blue-500/50', desc: 'Professional & Efficient' },
        { id: 'chill', label: 'Chill', icon: Coffee, color: 'text-amber-600', gradient: 'from-amber-500/10 to-orange-500/10', border: 'hover:border-amber-500/50', desc: 'Casual & Friendly' },
        { id: 'love', label: 'Love', icon: Heart, color: 'text-pink-500', gradient: 'from-pink-500/10 to-rose-500/10', border: 'hover:border-pink-500/50', desc: 'Romantic & Deep' },
    ] as const

    const modeStyles = {
        work: ['Concise', 'Formal', 'Action-oriented'],
        chill: ['Funny', 'Empathetic', 'Slang'],
        love: ['Flirty', 'Poetic', 'Supportive'],
    }

    const [customPrompt, setCustomPrompt] = React.useState('')
    const [selectedStyle, setSelectedStyle] = React.useState<string | null>(null)

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

    const panelVariants = {
        hidden: { x: '100%', opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        exit: {
            x: '100%',
            opacity: 0,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
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
                                            onClick={() => { onModeChange(null); setSelectedStyle(null); }}
                                            className="text-xs text-gray-500 hover:text-purple-600 transition-colors mt-1"
                                        >
                                            Change Mode
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => onRefresh(undefined, selectedStyle || undefined)}
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

                            {/* Style Chips */}
                            <div className="flex flex-wrap gap-2">
                                {mode && modeStyles[mode].map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => handleStyleClick(style)}
                                        className={cn(
                                            "text-[11px] font-medium px-3 py-1.5 rounded-full transition-all border shadow-sm",
                                            selectedStyle === style
                                                ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black dark:border-white shadow-md transform scale-105"
                                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                        )}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    {error}
                                </motion.div>
                            )}

                            {/* Interest Score & Icebreaker */}
                            {mode !== 'work' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="col-span-1 bg-white dark:bg-gray-900/50 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800/60 relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

                                        <div className="flex items-center gap-1.5 mb-2 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                            <Zap className="w-3 h-3" />
                                            Interest
                                        </div>

                                        <div className="relative flex items-center justify-center">
                                            <svg className="w-20 h-20 transform -rotate-90">
                                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={226} strokeDashoffset={226 - (226 * (insights?.interestScore || 0)) / 100} strokeLinecap="round" className={cn("transition-all duration-1000 ease-out drop-shadow-sm", getScoreColor(insights?.interestScore || 0).split(' ')[0])} />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className={cn("text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br", getScoreColor(insights?.interestScore || 0).split(' ').slice(1).join(' '))}>
                                                    {insights?.interestScore || 0}%
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.15 }}
                                        className="col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 shadow-sm border border-blue-100 dark:border-blue-800/30 flex flex-col justify-between min-h-[140px]"
                                    >
                                        <div className="flex items-center gap-1.5 mb-2 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                                            <Snowflake className="w-3 h-3" />
                                            Icebreaker
                                        </div>
                                        <div className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-snug">
                                            {insights?.icebreaker ? (
                                                `"${insights.icebreaker}"`
                                            ) : (
                                                <span className="opacity-50 italic">Analyzing context...</span>
                                            )}
                                        </div>
                                        {insights?.icebreaker && (
                                            <button
                                                onClick={() => onSuggestionClick(insights.icebreaker!)}
                                                className="mt-2 text-[10px] bg-white/80 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 text-blue-600 dark:text-blue-300 py-1.5 px-2 rounded-lg transition-colors w-full font-medium"
                                            >
                                                Use This
                                            </button>
                                        )}
                                    </motion.div>
                                </div>
                            )}

                            {/* Flags Alert Section */}
                            {(insights?.redFlags?.length || 0) > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl p-4"
                                >
                                    <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        Potential Flags
                                    </div>
                                    <ul className="space-y-1">
                                        {insights?.redFlags?.map((flag, i) => (
                                            <li key={i} className="text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                                                <span className="mt-1 w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                                                {flag}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                            {(insights?.greenFlags?.length || 0) > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4"
                                >
                                    <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Positive Signals
                                    </div>
                                    <ul className="space-y-1">
                                        {insights?.greenFlags?.map((flag, i) => (
                                            <li key={i} className="text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                                                <span className="mt-1 w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                                                {flag}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                            {/* Vibe Check */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/50 dark:to-gray-900/30 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800/60"
                            >
                                <div className="flex items-center gap-2 mb-3 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    Vibe Check
                                </div>
                                <div className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                                    {insights?.vibe ? (
                                        <>
                                            "{insights.vibe}"
                                        </>
                                    ) : (
                                        <span className="text-gray-400 italic text-sm">Thinking...</span>
                                    )}
                                </div>
                            </motion.div>

                            {/* Summary */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-gray-900/50 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800/60"
                            >
                                <div className="flex items-center gap-2 mb-3 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Coach Insights
                                </div>
                                <ul className="space-y-3">
                                    {insights?.summary ? (
                                        insights.summary.map((item, idx) => (
                                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-3">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-gray-400 italic">Analysis in progress...</li>
                                    )}
                                </ul>
                            </motion.div>

                            {/* Suggestions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    <Zap className="w-3.5 h-3.5" />
                                    Suggested Replies
                                </div>

                                <div className="space-y-2.5">
                                    {insights?.suggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => onSuggestionClick(suggestion)}
                                            className="w-full text-left p-4 bg-white dark:bg-gray-800/40 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-700/50 hover:border-purple-200 dark:hover:border-purple-700/50 rounded-xl text-sm text-gray-700 dark:text-gray-300 transition-all duration-200 group shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600 dark:group-hover:bg-purple-900/50 dark:group-hover:text-purple-300 transition-colors">
                                                    {idx + 1}
                                                </div>
                                                <span className="flex-1">{suggestion}</span>
                                                <ArrowLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500 rotate-180" />
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
