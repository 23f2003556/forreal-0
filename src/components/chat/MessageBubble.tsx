import React from 'react'
import { Check, CheckCheck, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface MessageBubbleProps {
    content: string
    time: string
    isOutgoing: boolean
    status?: 'sent' | 'delivered' | 'read'
    type?: 'text' | 'image' | 'audio'
}

export function MessageBubble({ content, time, isOutgoing, status = 'sent', type = 'text' }: MessageBubbleProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
                "flex mb-3",
                isOutgoing ? "justify-end" : "justify-start"
            )}
        >
            <div className={cn(
                "relative max-w-[75%] rounded-2xl shadow-sm text-sm overflow-hidden",
                isOutgoing
                    ? "bg-outgoing-background text-white rounded-br-none"
                    : "bg-incoming-background text-text-primary border border-gray-100 dark:border-gray-800 rounded-bl-none",
                type === 'image' ? "p-1" : "px-4 py-2"
            )}>
                <div className={cn(
                    "flex flex-col",
                    type === 'text' ? "gap-1" : ""
                )}>
                    {type === 'text' && (
                        <span className="leading-relaxed text-[15px]">{content}</span>
                    )}

                    {type === 'image' && (
                        <div className="rounded-xl overflow-hidden mb-1">
                            <img src={content} alt="Image message" className="max-w-full h-auto max-h-[300px] object-cover" />
                        </div>
                    )}

                    {type === 'audio' && (
                        <div className="flex items-center gap-3 px-1 py-1 min-w-[200px]">
                            <button className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                isOutgoing ? "bg-white/20 hover:bg-white/30 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            )}>
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                            </button>
                            <div className="h-1 flex-1 bg-gray-300/30 rounded-full relative overflow-hidden">
                                <div className={cn(
                                    "absolute left-0 top-0 h-full w-1/3 rounded-full",
                                    isOutgoing ? "bg-white" : "bg-primary"
                                )}></div>
                            </div>
                            <span className={cn(
                                "text-xs font-medium",
                                isOutgoing ? "text-white/80" : "text-text-secondary"
                            )}>0:15</span>
                        </div>
                    )}

                    <div className={cn(
                        "flex items-center justify-end gap-1 mt-0.5",
                        isOutgoing ? "text-white/70" : "text-text-secondary"
                    )}>
                        <span className="text-[10px] font-medium">{time}</span>
                        {isOutgoing && (
                            <span className="text-[10px]">
                                {status === 'read' ? <CheckCheck className="w-3 h-3 text-blue-500" /> :
                                    status === 'delivered' ? <CheckCheck className="w-3 h-3" /> :
                                        <Check className="w-3 h-3" />}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

