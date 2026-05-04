/* global React */
const { useState } = React;

// ============================================================================
// FORREAL CHAT — calm version
// One read at a time. Insights on demand, not in your face.
// ============================================================================

const CONTACTS = [
  { id: 'sarthak', name: 'Sarthak Chaudhary', mood: 'longing',  color: '#a371ff', initials: 'SC', last: 'In the realm of code...',  t: '21:15', unread: 0, active: true },
  { id: 'maya',    name: 'Maya',              mood: 'flirty',   color: '#ff6bb5', initials: 'M',  last: 'wait you ACTUALLY went?', t: '20:58', unread: 2 },
  { id: 'james',   name: 'James',             mood: 'tense',    color: '#ffb056', initials: 'J',  last: 'sounds good 👍',          t: '20:31', unread: 4 },
  { id: 'priya',   name: 'Priya Patel',       mood: 'warm',     color: '#5fe49a', initials: 'PP', last: 'tuesday works for me',    t: '19:12', unread: 0 },
  { id: 'mom',     name: 'Mom',               mood: 'worried',  color: '#7fb8ff', initials: 'M',  last: 'are you eating?',         t: '17:40', unread: 1 },
  { id: 'devs',    name: '#engineering',      mood: 'flat',     color: '#c9a3ff', initials: '#',  last: 'rolling deploy at 6',     t: '15:22', unread: 0 },
];

const THREAD = [
  { side: 'them', text: "What's bothering you, let's talk it out", t: '21:11' },
  { side: 'me',   text: "i like you as a brother", t: '21:12' },
  { side: 'them', text: "Lol what's good bro?", t: '21:13',
    read: { mood: 'deflecting', subtext: '"that landed harder than you think"' } },
  { side: 'me',   text: "can we have a meeting on blockchain", t: '21:13' },
  { side: 'them', text: "Wednesday at 4pm? works?", t: '21:14' },
  { side: 'me',   text: "I'm looking forward to our meeting on Wednesday, what topics should we prioritize?", t: '21:14' },
  { side: 'them', text: "I'm looking forward to our meeting on Wednesday, have you given any thought to the key blockchain topics you'd like to cover?", t: '21:15',
    read: { mood: 'mirroring formality', subtext: '"you went distant, so did i"' } },
  { side: 'them', text: "In the realm of code and innovation, I find myself searching for a glimpse of your heart, a spark that sets my soul aflame", t: '21:15',
    read: { mood: 'longing', subtext: '"i want the real conversation back"' } },
];

function ChatApp() {
  const [activeContact, setActiveContact] = useState(0);
  const [openInsight, setOpenInsight] = useState(7); // index of message with read open
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div style={s.app}>
      <Sidebar activeIdx={activeContact} setActive={setActiveContact} />
      <main style={s.main}>
        <ChatHeader contact={CONTACTS[activeContact]} onDetails={() => setShowDetails(!showDetails)} detailsOpen={showDetails} />
        <ReadStrip />
        <Thread openInsight={openInsight} setOpenInsight={setOpenInsight} />
        <Composer />
      </main>
      {showDetails && <DetailsSheet onClose={() => setShowDetails(false)} />}
    </div>
  );
}

// -------------------- SIDEBAR --------------------
function Sidebar({ activeIdx, setActive }) {
  return (
    <aside style={s.sidebar}>
      <div style={s.brandRow}>
        <span style={s.brandMark}><span style={s.brandMarkInner} /></span>
        <span style={s.brandName}>forreal<span style={{ color: '#a371ff' }}>.</span></span>
      </div>

      <div style={s.search}>
        <span style={s.searchIcon}>⌕</span>
        <span style={s.searchPh}>Search</span>
      </div>

      <div style={s.contactList}>
        {CONTACTS.map((c, i) => (
          <ContactRow key={c.id} c={c} active={i === activeIdx} onClick={() => setActive(i)} />
        ))}
      </div>
    </aside>
  );
}

function ContactRow({ c, active, onClick }) {
  return (
    <div onClick={onClick} style={{ ...s.contactRow, ...(active ? s.contactRowActive : null) }}>
      <div style={{ ...s.avatar, background: c.color }}>{c.initials}</div>
      <div style={s.contactBody}>
        <div style={s.contactTop}>
          <span style={s.contactName}>{c.name}</span>
          <span style={s.contactTime}>{c.t}</span>
        </div>
        <div style={s.contactBottom}>
          <span style={s.contactLast}>{c.last}</span>
          {c.unread > 0 && <span style={s.unread}>{c.unread}</span>}
        </div>
      </div>
      <span style={{ ...s.moodPip, background: c.color, opacity: active ? 1 : 0.5 }} title={c.mood} />
    </div>
  );
}

// -------------------- CHAT HEADER --------------------
function ChatHeader({ contact, onDetails, detailsOpen }) {
  return (
    <header style={s.chatHeader}>
      <div style={{ ...s.avatar, background: contact.color, width: 32, height: 32, fontSize: 12 }}>{contact.initials}</div>
      <div style={s.chatHeaderName}>{contact.name}</div>
      <span style={{ flex: 1 }} />
      <button onClick={onDetails} style={{ ...s.headerBtn, ...(detailsOpen ? s.headerBtnHot : null) }}>Details</button>
    </header>
  );
}

// -------------------- READ STRIP (the one calm line) --------------------
function ReadStrip() {
  return (
    <div style={s.readStrip}>
      <span style={s.readLabel}>READ</span>
      <span style={s.readDivider} />
      <span style={s.readText}>
        <span style={s.readMood}>longing</span>
        <span style={s.readArrow}>→</span>
        <span style={s.readSubtext}>they want the real conversation back</span>
      </span>
      <span style={{ flex: 1 }} />
      <span style={s.readPrivacy}>
        <span style={s.privacyDot} />
        on-device
      </span>
    </div>
  );
}

// -------------------- THREAD --------------------
function Thread({ openInsight, setOpenInsight }) {
  return (
    <div style={s.thread}>
      <div style={s.threadInner}>
        {THREAD.map((m, i) => (
          <Bubble key={i} m={m} idx={i} open={openInsight === i} setOpen={setOpenInsight} />
        ))}
      </div>
    </div>
  );
}

function Bubble({ m, idx, open, setOpen }) {
  const isMe = m.side === 'me';
  const hasRead = !!m.read;

  return (
    <div style={{ ...s.bubbleRow, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%', gap: 6 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ ...s.bubble, ...(isMe ? s.bubbleMe : s.bubbleThem) }}>
            {m.text}
          </div>
          {hasRead && !isMe && (
            <button
              onClick={() => setOpen(open ? -1 : idx)}
              style={{ ...s.readDot, ...(open ? s.readDotOpen : null) }}
              title="show read"
            />
          )}
        </div>

        {hasRead && open && (
          <div style={s.readCard}>
            <div style={s.readCardRow}>
              <span style={s.readCardLabel}>mood</span>
              <span style={s.readCardValue}>{m.read.mood}</span>
            </div>
            <div style={s.readCardRow}>
              <span style={s.readCardLabel}>subtext</span>
              <span style={{ ...s.readCardValue, fontStyle: 'italic', color: '#ffc1de' }}>{m.read.subtext}</span>
            </div>
          </div>
        )}

        <div style={s.bubbleTime}>{m.t}</div>
      </div>
    </div>
  );
}

// -------------------- COMPOSER --------------------
function Composer() {
  const [draft, setDraft] = useState('');
  const [showSuggest, setShowSuggest] = useState(true);

  return (
    <div style={s.composerWrap}>
      {showSuggest && !draft && (
        <button onClick={() => setDraft("ok no, let me actually answer that.")} style={s.suggestPill}>
          <span style={s.suggestIcon}>✦</span>
          <span>Try a warmer reply</span>
          <span style={s.suggestArrow}>→</span>
          <span style={s.suggestClose} onClick={(e) => { e.stopPropagation(); setShowSuggest(false); }}>×</span>
        </button>
      )}

      <div style={s.composer}>
        <button style={s.composerAttach}>+</button>
        <input
          style={s.composerInput}
          placeholder="Message — Forreal previews tone before you send"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        {draft && (
          <span style={s.tonePreview}>
            <span style={s.tonePreviewDot} />
            warm · sincere
          </span>
        )}
        <button style={{ ...s.composerSend, ...(draft ? s.composerSendActive : null) }}>↑</button>
      </div>
    </div>
  );
}

// -------------------- DETAILS SHEET (summoned, not always on) --------------------
function DetailsSheet({ onClose }) {
  return (
    <aside style={s.sheet}>
      <div style={s.sheetHeader}>
        <span style={s.sheetTitle}>Sarthak — last 24h</span>
        <button onClick={onClose} style={s.sheetClose}>×</button>
      </div>

      <div style={s.sheetBlock}>
        <div style={s.sheetLabel}>Mood arc</div>
        <MoodLine />
      </div>

      <div style={s.sheetBlock}>
        <div style={s.sheetLabel}>Intent</div>
        <Bar label="Reconnect"     pct={62} active />
        <Bar label="Joke / deflect" pct={24} />
        <Bar label="Exit"          pct={14} />
      </div>

      <div style={s.sheetBlock}>
        <div style={s.sheetLabel}>Memory</div>
        <Memo>"the brother thing" — twice this month</Memo>
        <Memo>opens warm, closes formal — 73% of threads</Memo>
        <Memo>unresolved: february birthday text</Memo>
      </div>

      <div style={s.sheetFootnote}>
        Everything stays on your device. Forreal never reads above what you can see here.
      </div>
    </aside>
  );
}

function MoodLine() {
  // simple small line chart 8 points, ending climbing
  const points = [0.4, 0.35, 0.3, 0.5, 0.45, 0.4, 0.6, 0.75];
  const w = 260, h = 56;
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - (p * h);
    return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ');
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="mline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a371ff" />
          <stop offset="100%" stopColor="#ff6bb5" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke="url(#mline)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => {
        const x = (i / (points.length - 1)) * w;
        const y = h - (p * h);
        const last = i === points.length - 1;
        return <circle key={i} cx={x} cy={y} r={last ? 4 : 2} fill={last ? '#ff6bb5' : '#a371ff'} />;
      })}
    </svg>
  );
}

function Bar({ label, pct, active }) {
  return (
    <div style={s.barRow}>
      <div style={s.barLabel}>
        <span>{label}</span>
        <span style={s.barPct}>{pct}%</span>
      </div>
      <div style={s.barTrack}>
        <div style={{
          ...s.barFill,
          width: pct + '%',
          background: active ? 'linear-gradient(90deg,#a371ff,#ff6bb5)' : 'rgba(255,255,255,0.18)',
        }} />
      </div>
    </div>
  );
}

function Memo({ children }) {
  return (
    <div style={s.memo}>
      <span style={s.memoBullet}>·</span>
      <span>{children}</span>
    </div>
  );
}

// ============================================================================
// STYLES
// ============================================================================
const C = {
  bg: '#0a0710',
  bg2: '#0d0916',
  bg3: '#15102a',
  border: 'rgba(255,255,255,0.06)',
  borderHot: 'rgba(163,113,255,0.35)',
  text: '#fff',
  text2: 'rgba(255,255,255,0.65)',
  text3: 'rgba(255,255,255,0.42)',
  accent: '#a371ff',
  accent2: '#ff6bb5',
  good: '#5fe49a',
};

const s = {
  app: {
    width: '100%',
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    background: C.bg,
    color: C.text,
    fontFamily: '"Inter", system-ui, sans-serif',
    fontSize: 14,
    overflow: 'hidden',
    position: 'relative',
  },

  // SIDEBAR
  sidebar: {
    background: C.bg2,
    borderRight: `1px solid ${C.border}`,
    display: 'flex', flexDirection: 'column',
    minHeight: 0,
  },
  brandRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '20px 20px 16px',
  },
  brandMark: {
    width: 26, height: 26, borderRadius: 7,
    background: 'linear-gradient(135deg,#a371ff,#ff6bb5)',
    display: 'grid', placeItems: 'center',
  },
  brandMarkInner: { width: 9, height: 9, borderRadius: '50%', background: C.bg2 },
  brandName: { fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em' },

  search: {
    margin: '0 16px 14px',
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', gap: 10,
    color: C.text3,
  },
  searchIcon: { fontSize: 13 },
  searchPh: { fontSize: 13 },

  contactList: {
    flex: 1, minHeight: 0,
    overflow: 'auto',
    padding: '0 8px 16px',
    display: 'flex', flexDirection: 'column', gap: 1,
  },
  contactRow: {
    display: 'flex', alignItems: 'center', gap: 11,
    padding: '10px 12px',
    borderRadius: 10,
    cursor: 'pointer',
    border: '1px solid transparent',
    position: 'relative',
  },
  contactRowActive: {
    background: 'rgba(163,113,255,0.10)',
  },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    display: 'grid', placeItems: 'center',
    color: '#fff', fontWeight: 600, fontSize: 12,
    flexShrink: 0,
  },
  contactBody: { flex: 1, minWidth: 0 },
  contactTop: { display: 'flex', justifyContent: 'space-between', gap: 8 },
  contactName: {
    fontSize: 13.5, fontWeight: 500,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  contactTime: { fontSize: 11, color: C.text3, flexShrink: 0 },
  contactBottom: { display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 2 },
  contactLast: {
    fontSize: 12.5, color: C.text3,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    flex: 1,
  },
  unread: {
    background: 'linear-gradient(135deg,#a371ff,#ff6bb5)',
    color: '#fff', fontSize: 10, fontWeight: 600,
    padding: '1px 6px', borderRadius: 999,
    minWidth: 18, textAlign: 'center', flexShrink: 0,
  },
  moodPip: {
    position: 'absolute',
    left: 4, top: '50%', transform: 'translateY(-50%)',
    width: 3, height: 22, borderRadius: 2,
  },

  // MAIN
  main: {
    display: 'flex', flexDirection: 'column',
    minWidth: 0, minHeight: 0,
    background: C.bg,
  },
  chatHeader: {
    display: 'flex', alignItems: 'center', gap: 11,
    padding: '14px 24px',
    borderBottom: `1px solid ${C.border}`,
  },
  chatHeaderName: { fontWeight: 600, fontSize: 15 },
  headerBtn: {
    background: 'transparent',
    border: `1px solid ${C.border}`,
    color: C.text2,
    padding: '6px 14px',
    fontSize: 12.5,
    borderRadius: 7,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  headerBtnHot: {
    background: 'rgba(163,113,255,0.12)',
    borderColor: C.borderHot,
    color: '#fff',
  },

  // READ STRIP
  readStrip: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '11px 24px',
    background: 'linear-gradient(90deg, rgba(163,113,255,0.10), rgba(255,107,181,0.04) 50%, transparent)',
    borderBottom: `1px solid ${C.border}`,
    fontSize: 13,
  },
  readLabel: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 10, letterSpacing: '0.22em',
    color: '#c9a3ff',
  },
  readDivider: {
    width: 1, height: 12,
    background: 'rgba(163,113,255,0.3)',
  },
  readText: {
    display: 'flex', alignItems: 'center', gap: 10,
    minWidth: 0,
  },
  readMood: {
    color: '#ff8fc2',
    fontStyle: 'italic',
    fontFamily: 'Instrument Serif, serif',
    fontSize: 17,
  },
  readArrow: { color: C.text3, fontSize: 11 },
  readSubtext: {
    color: C.text2,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  readPrivacy: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 10.5, letterSpacing: '0.08em',
    color: C.text3,
    flexShrink: 0,
  },
  privacyDot: {
    width: 5, height: 5, borderRadius: '50%',
    background: C.good,
    boxShadow: '0 0 0 2px rgba(95,228,154,0.18)',
  },

  // THREAD
  thread: {
    flex: 1, minHeight: 0, overflow: 'auto',
  },
  threadInner: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '32px 24px 16px',
    display: 'flex', flexDirection: 'column',
    gap: 18,
  },
  bubbleRow: { display: 'flex' },
  bubble: {
    padding: '11px 16px',
    borderRadius: 18,
    fontSize: 14.5, lineHeight: 1.5,
  },
  bubbleMe: {
    background: 'linear-gradient(180deg,#a371ff,#7c4ddb)',
    color: '#fff',
    borderBottomRightRadius: 6,
  },
  bubbleThem: {
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    borderBottomLeftRadius: 6,
  },
  bubbleTime: {
    fontSize: 10.5, color: C.text3, letterSpacing: '0.05em',
    paddingLeft: 4,
  },

  readDot: {
    position: 'absolute',
    right: -6, top: -6,
    width: 16, height: 16,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#a371ff,#ff6bb5)',
    border: '3px solid #0a0710',
    cursor: 'pointer',
    padding: 0,
    transition: 'transform 0.15s ease',
  },
  readDotOpen: {
    transform: 'scale(1.15)',
  },

  readCard: {
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid rgba(163,113,255,0.25)`,
    borderRadius: 10,
    padding: '10px 14px',
    display: 'flex', flexDirection: 'column', gap: 5,
    maxWidth: '100%',
  },
  readCardRow: {
    display: 'flex', alignItems: 'baseline', gap: 12,
    fontSize: 13,
  },
  readCardLabel: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 10, letterSpacing: '0.16em',
    color: C.text3,
    textTransform: 'uppercase',
    minWidth: 60,
  },
  readCardValue: { color: '#fff' },

  // COMPOSER
  composerWrap: {
    padding: '10px 24px 16px',
    borderTop: `1px solid ${C.border}`,
  },
  suggestPill: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(163,113,255,0.10)',
    border: `1px solid ${C.borderHot}`,
    color: '#fff',
    padding: '6px 8px 6px 12px',
    borderRadius: 999,
    fontSize: 12.5,
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginBottom: 10,
  },
  suggestIcon: { color: '#c9a3ff', fontSize: 11 },
  suggestArrow: { color: C.text3, fontSize: 12 },
  suggestClose: {
    width: 18, height: 18,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    color: C.text3,
    display: 'inline-grid', placeItems: 'center',
    fontSize: 14, lineHeight: 1,
    marginLeft: 2,
  },

  composer: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: 6,
    maxWidth: 720,
    margin: '0 auto',
  },
  composerAttach: {
    width: 32, height: 32,
    background: 'transparent',
    border: 'none',
    color: C.text3,
    fontSize: 18,
    cursor: 'pointer',
    flexShrink: 0,
  },
  composerInput: {
    flex: 1, padding: '8px 4px',
    background: 'transparent',
    border: 'none', outline: 'none',
    color: '#fff', fontSize: 14,
    fontFamily: 'inherit',
    minWidth: 0,
  },
  tonePreview: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 10px',
    background: 'rgba(95,228,154,0.10)',
    border: '1px solid rgba(95,228,154,0.25)',
    borderRadius: 999,
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 11,
    color: '#9ef0bd',
    flexShrink: 0,
  },
  tonePreviewDot: {
    width: 5, height: 5, borderRadius: '50%',
    background: C.good,
  },
  composerSend: {
    width: 36, height: 36,
    background: 'rgba(255,255,255,0.06)',
    border: 'none',
    color: C.text3,
    borderRadius: 10,
    fontSize: 16,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background 0.15s, color 0.15s',
  },
  composerSendActive: {
    background: 'linear-gradient(135deg,#a371ff,#ff6bb5)',
    color: '#fff',
  },

  // DETAILS SHEET
  sheet: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0,
    width: 340,
    background: 'rgba(13,9,22,0.98)',
    borderLeft: `1px solid ${C.border}`,
    backdropFilter: 'blur(12px)',
    display: 'flex', flexDirection: 'column',
    overflow: 'auto',
    boxShadow: '-20px 0 40px rgba(0,0,0,0.4)',
    animation: 'fr-sheet 0.2s ease',
  },
  sheetHeader: {
    display: 'flex', alignItems: 'center',
    padding: '18px 22px',
    borderBottom: `1px solid ${C.border}`,
  },
  sheetTitle: {
    flex: 1,
    fontSize: 14, fontWeight: 600,
  },
  sheetClose: {
    width: 28, height: 28,
    background: 'rgba(255,255,255,0.04)',
    border: 'none',
    color: C.text2,
    borderRadius: 8,
    fontSize: 18,
    cursor: 'pointer',
  },
  sheetBlock: {
    padding: '20px 22px',
    borderBottom: `1px solid ${C.border}`,
  },
  sheetLabel: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 10.5, letterSpacing: '0.18em',
    color: C.text3,
    marginBottom: 12,
  },

  barRow: { marginBottom: 10 },
  barLabel: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: 12.5, marginBottom: 5,
    color: C.text2,
  },
  barPct: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 11, color: C.text3,
  },
  barTrack: {
    height: 4,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 2 },

  memo: {
    display: 'flex', gap: 10,
    fontSize: 13, lineHeight: 1.5,
    color: C.text2,
    padding: '6px 0',
  },
  memoBullet: { color: C.accent, fontSize: 16, lineHeight: 1 },

  sheetFootnote: {
    padding: '16px 22px',
    fontSize: 11.5,
    color: C.text3,
    fontStyle: 'italic',
    fontFamily: 'Instrument Serif, serif',
  },
};

window.ChatApp = ChatApp;
