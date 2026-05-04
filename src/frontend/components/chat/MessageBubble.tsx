import React from 'react'
import { Check, CheckCheck, Play } from 'lucide-react'
import { MessageActions } from './MessageActions'

interface MessageBubbleProps {
    id: string
    content: string
    time: string
    isOutgoing: boolean
    status?: 'sent' | 'delivered' | 'read'
    type?: 'text' | 'image' | 'audio'
    reactions?: Record<string, string[]>
    onAction: (id: string, action: string, data?: any) => void
}

export function MessageBubble({ id, content, time, isOutgoing, status = 'sent', type = 'text', reactions = {}, onAction }: MessageBubbleProps) {
    const handleAction = (action: string, data?: any) => {
        if (action === 'copy') {
            navigator.clipboard.writeText(content)
            return
        }
        onAction(id, action, data)
    }

    return (
        <div style={{ display: 'flex', justifyContent: isOutgoing ? 'flex-end' : 'flex-start', marginBottom: 18, position: 'relative' }} className="group/bubble">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isOutgoing ? 'flex-end' : 'flex-start', maxWidth: '70%', gap: 6 }}>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        padding: type === 'image' ? '4px' : '11px 16px',
                        borderRadius: 18,
                        fontSize: 14.5,
                        lineHeight: 1.5,
                        background: isOutgoing ? 'linear-gradient(180deg,#a371ff,#7c4ddb)' : 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        borderBottomRightRadius: isOutgoing ? 6 : 18,
                        borderBottomLeftRadius: isOutgoing ? 18 : 6
                    }}>
                        {type === 'text' && <span>{content}</span>}
                        {type === 'image' && (
                            <img src={content} alt="Message" style={{ maxWidth: '100%', borderRadius: 14 }} />
                        )}
                        {type === 'audio' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 200 }}>
                                <Play size={16} /> <span style={{fontSize: 12}}>Audio Message</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Action Menu Trigger */}
                    <div className={isOutgoing ? "absolute top-0 -left-8 opacity-0 group-hover/bubble:opacity-100 transition-opacity" : "absolute top-0 -right-8 opacity-0 group-hover/bubble:opacity-100 transition-opacity"}>
                        <MessageActions isOutgoing={isOutgoing} onAction={handleAction} />
                    </div>
                </div>
                
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.42)', letterSpacing: '0.05em', paddingLeft: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {time}
                    {isOutgoing && (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            {status === 'read' ? <CheckCheck size={12} color="#5fe49a" /> :
                                status === 'delivered' ? <CheckCheck size={12} /> :
                                    <Check size={12} />}
                        </span>
                    )}
                </div>

                {Object.keys(reactions).length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                        {Object.entries(reactions).map(([emoji, users]) => (
                            <div key={emoji} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '2px 6px', fontSize: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                                {emoji} {users.length > 1 && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{users.length}</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
