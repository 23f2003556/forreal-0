import React from 'react'

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

export function CoachPanel({ isOpen, onClose, loading, insights, onSuggestionClick }: CoachPanelProps) {
    if (!isOpen) return null

    return (
        <aside style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 340,
            background: 'rgba(13,9,22,0.98)', borderLeft: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column',
            overflow: 'auto', boxShadow: '-20px 0 40px rgba(0,0,0,0.4)', zIndex: 50,
            color: '#fff', fontFamily: '"Inter", system-ui, sans-serif'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>Forreal Insights</span>
                <button onClick={onClose} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.65)', borderRadius: 8, fontSize: 18, cursor: 'pointer' }}>×</button>
            </div>

            {loading && (
                <div style={{ padding: '20px 22px', color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>Analyzing chat...</div>
            )}

            {!loading && insights && (
                <>
                    <div style={{ padding: '20px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.42)', marginBottom: 12 }}>VIBE CHECK</div>
                        <div style={{ color: '#fff', fontSize: 14 }}>{insights.vibe || "Listening for vibes..."}</div>
                    </div>

                    <div style={{ padding: '20px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.42)', marginBottom: 12 }}>MEMORY & INSIGHTS</div>
                        {insights.summary?.map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, lineHeight: 1.5, color: 'rgba(255,255,255,0.65)', padding: '6px 0' }}>
                                <span style={{ color: '#a371ff', fontSize: 16, lineHeight: 1 }}>·</span>
                                <span>{s}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '20px 22px' }}>
                        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.42)', marginBottom: 12 }}>SUGGESTED REPLIES</div>
                        {insights.suggestions?.map((s, i) => (
                            <button key={i} onClick={() => onSuggestionClick(s)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, color: '#fff', fontSize: 13, marginBottom: 8, cursor: 'pointer' }}>
                                {s}
                            </button>
                        ))}
                    </div>
                </>
            )}

            <div style={{ marginTop: 'auto', padding: '16px 22px', fontSize: 11.5, color: 'rgba(255,255,255,0.42)', fontStyle: 'italic', fontFamily: '"Instrument Serif", serif' }}>
                Everything stays on your device. Forreal never reads above what you can see here.
            </div>
        </aside>
    )
}
