import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Reply,
    Smile,
    Star,
    Pin,
    Forward,
    Copy,
    Info,
    Trash2,
    MoreHorizontal,
    ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageActionsProps {
    isOutgoing: boolean
    onAction: (action: string, data?: any) => void
}

export function MessageActions({ isOutgoing, onAction }: MessageActionsProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [showReactions, setShowReactions] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setShowReactions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleAction = (action: string, data?: any) => {
        onAction(action, data)
        setIsOpen(false)
        setShowReactions(false)
    }

    const menuItems = [
        { icon: Reply, label: 'Reply', action: 'reply' },
        { icon: Smile, label: 'React', action: 'react_menu', onClick: () => setShowReactions(true) },
        { icon: Star, label: 'Star', action: 'star' },
        { icon: Pin, label: 'Pin', action: 'pin' },
        { icon: Forward, label: 'Forward', action: 'forward' },
        { icon: Copy, label: 'Copy', action: 'copy' },
        { icon: Info, label: 'Info', action: 'info' },
        { icon: Trash2, label: 'Delete', action: 'delete', className: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' },
    ]

    const reactions = ['👍', '❤️', '😂', '😮', '😢', '🙏']

    return (
        <div className="relative group/actions" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
                className={cn(
                    "p-1 rounded-full bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm transition-all shadow-sm opacity-0 group-hover/bubble:opacity-100",
                    isOutgoing ? "text-white/80 hover:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                )}
            >
                <ChevronDown className="w-3 h-3" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="absolute top-0 z-50">
                        {/* Positioning wrapper to handle overflow/placement */}
                        <div className={cn(
                            "absolute top-6 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden py-1",
                            isOutgoing ? "right-0" : "left-0"
                        )}>
                            {showReactions ? (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-2 grid grid-cols-6 gap-1"
                                >
                                    {reactions.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => handleAction('react', emoji)}
                                            className="hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded transition-colors text-lg flex items-center justify-center"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (item.onClick) {
                                                    item.onClick()
                                                } else {
                                                    handleAction(item.action)
                                                }
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                                                item.className || "text-gray-700 dark:text-gray-200"
                                            )}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
