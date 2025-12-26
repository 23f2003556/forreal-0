import React from 'react'
import { Check, CheckCheck, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
    content: string
    time: string
    isOutgoing: boolean
    status?: 'sent' | 'delivered' | 'read'
    type?: 'text' | 'image' | 'audio'
}

export function MessageBubble({ content, time, isOutgoing, status = 'sent', type = 'text' }: MessageBubbleProps) {
    return (
        <div className={cn(
            "flex mb-2",
            isOutgoing ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "relative max-w-[65%] rounded-lg shadow-sm text-sm",
                isOutgoing ? "bg-outgoing-background rounded-tr-none" : "bg-incoming-background rounded-tl-none",
                type === 'image' ? "p-1" : "px-2 py-1"
            )}>
                {/* Tail for bubble */}
                <div className={cn(
                    "absolute top-0 w-0 h-0 border-[6px] border-transparent",
                    isOutgoing
                        ? "right-[-6px] border-t-outgoing-background border-l-outgoing-background"
                        : "left-[-6px] border-t-incoming-background border-r-incoming-background"
                )}></div>

                <div className={cn(
                    "text-text-primary",
                    type === 'text' ? "px-1 pt-1 pb-4" : "pb-4"
                )}>
                    {type === 'text' && content}

                    {type === 'image' && (
                        <div className="rounded-lg overflow-hidden mb-1">
                            <img src={content} alt="Image message" className="max-w-full h-auto max-h-[300px] object-cover" />
                        </div>
                    )}

                    {type === 'audio' && (
                        <div className="flex items-center gap-3 px-2 py-2 min-w-[200px]">
                            <button className="text-icon-gray">
                                <Play className="w-6 h-6 fill-current" />
                            </button>
                            <div className="h-1 flex-1 bg-gray-300 rounded-full relative">
                                <div className="absolute left-0 top-0 h-full w-1/3 bg-icon-gray rounded-full"></div>
                                <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-teal-primary rounded-full shadow"></div>
                            </div>
                            <span className="text-xs text-text-secondary">0:15</span>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                    <span className="text-[11px] text-text-secondary">{time}</span>
                    {isOutgoing && (
                        <span className={cn(
                            "text-[11px]",
                            status === 'read' ? "text-blue-500" : "text-text-secondary"
                        )}>
                            {status === 'read' ? <CheckCheck className="w-3 h-3" /> :
                                status === 'delivered' ? <CheckCheck className="w-3 h-3" /> :
                                    <Check className="w-3 h-3" />}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
