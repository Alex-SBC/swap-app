import { useState } from "react";

// ─── Theme ───────────────────────────────────────────────────────────────────
const theme = {
  bg:          "#0F1021",
  bgDeep:      "#090A17",
  surface:     "#161829",
  surfaceHigh: "#1E2038",
  border:      "#252740",
  borderSoft:  "#1D1F35",

  purple:      "#9B7FFF",
  purpleSoft:  "#7B5FDF",
  teal:        "#2DD4BF",
  tealSoft:    "#14B8A6",
  gold:        "#F59E0B",
  goldSoft:    "#D97706",
  rose:        "#FB7185",
  roseSoft:    "#F43F5E",
  jade:        "#34D399",

  text:        "#F0F0FA",
  textSub:     "#9090B0",
  textDim:     "#50507A",

  gradPurple:  "linear-gradient(135deg, #9B7FFF 0%, #6D45E8 100%)",
  gradTeal:    "linear-gradient(135deg, #2DD4BF 0%, #0891B2 100%)",
  gradGold:    "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
  gradRose:    "linear-gradient(135deg, #FB7185 0%, #9B7FFF 100%)",
  gradFull:    "linear-gradient(135deg, #9B7FFF 0%, #2DD4BF 60%, #F59E0B 100%)",
};

// ─── Categories ──────────────────────────────────────────────────────────────
const CATS = {
  errands:   { emoji: "🛍️",  label: "Errands",   color: theme.gold,   grad: theme.gradGold },
  housework: { emoji: "🏠",  label: "Housework", color: theme.teal,   grad: theme.gradTeal },
  cooking:   { emoji: "🍳",  label: "Cooking",   color: theme.rose,   grad: theme.gradRose },
  intimacy:  { emoji: "✨",  label: "Intimacy",  color: theme.purple, grad: theme.gradPurple },
  fun:       { emoji: "🎲",  label: "Fun",       color: theme.jade,   grad: theme.gradTeal },
  sports:    { emoji: "🏃",  label: "Sports",    color: theme.teal,   grad: theme.gradTeal },
  kids:      { emoji: "🧒",  label: "Kids",      color: theme.gold,   grad: theme.gradGold },
  pets:      { emoji: "🐾",  label: "Pets",      color: theme.rose,   grad: theme.gradRose },
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const ME = { name: "Alex", avatar: "🌙", xp: 720, level: 5, streak: 12 };
const PARTNER = { name: "Will", avatar: "⚡", xp: 580, level: 4, streak: 12 };

const SWAPS = [
  { id: 1, cat: "cooking",   title: "Cook dinner tonight",    from: "me", status: "active",    deadline: "Today" },
  { id: 2, cat: "sports",    title: "30 min jog together",    from: "partner", status: "active", deadline: "Mar 28" },
  { id: 3, cat: "housework", title: "Do the laundry",         from: "me", status: "completed", deadline: "Mar 20" },
  { id: 4, cat: "intimacy",  title: "Massage night",          from: "partner", status: "pending", deadline: "Mar 30" },
  { id: 5, cat: "fun",       title: "Pick the movie",         from: "me", status: "active",    deadline: "This week" },
  { id: 6, cat: "errands",   title: "Grocery run",            from: "partner", status: "active", deadline: "Tomorrow" },
];

const ACHIEVEMENTS = [
  { id: 1, icon: "🎉", title: "First Trade",      desc: "Made your first swap",        done: true },
  { id: 2, icon: "🔄", title: "Keep Trading",     desc: "Created 5 swaps",             done: true },
  { id: 3, icon: "✅", title: "Commitment",       desc: "Completed your first swap",   done: true },
  { id: 4, icon: "🏃", title: "On a Roll",        desc: "Complete 3 swaps",            done: false, progress: 2, target: 3 },
  { id: 5, icon: "💪", title: "Duo Power",        desc: "Partner completes your swap", done: false, progress: 0, target: 1 },
  { id: 6, icon: "🔥", title: "7-Day Streak",     desc: "7 consecutive days",          done: false, progress: 5, target: 7 },
];

const font     = `'Plus Jakarta Sans', 'Inter', sans-serif`;
const fontDisp = `'Syne', 'Plus Jakarta Sans', sans-serif`;

// ─── Shared primitives ────────────────────────────────────────────────────────
function Bar({ value, max, color, h = 5, style = {} }) {
  return (
    <div style={{ width: "100%", height: h, background: theme.border, borderRadius: h, overflow: "hidden", ...style }}>
      <div style={{
        width: `${Math.min((value / max) * 100, 100)}%`, height: "100%",
        background: color, borderRadius: h,
        transition: "width 0.9s cubic-bezier(.4,0,.2,1)",
      }} />
    </div>
  );
}

function Chip({ children, color = theme.purple, style = {} }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "3px 10px",
      borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: 0.6,
      background: color + "22", color, fontFamily: font,
      textTransform: "uppercase", ...style,
    }}>{children}</span>
  );
}

function Card({ children, style = {}, glow }) {
  return (
    <div style={{
      background: theme.surface, borderRadius: 18, padding: 16,
      border: `1px solid ${glow ? glow + "44" : theme.border}`,
      boxShadow: glow ? `0 0 24px ${glow}18` : "none",
      ...style,
    }}>{children}</div>
  );
}

function Btn({ children, grad, color, outline, small, full, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      padding: small ? "8px 16px" : "13px 20px",
      width: full ? "100%" : undefined,
      borderRadius: 14, border: outline ? `1px solid ${color || theme.border}` : "none",
      background: outline ? "transparent" : (grad || color || theme.purple),
      color: outline ? (color || theme.textSub) : "#fff",
      fontSize: small ? 12 : 14, fontFamily: font, fontWeight: 700,
      cursor: "pointer", letterSpacing: 0.3, transition: "opacity .15s",
      ...style,
    }} onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
       onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >{children}</button>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "home",     icon: "✦",  label: "Home" },
  { id: "swaps",    icon: "🎟", label: "Swaps" },
  { id: "create",   icon: "＋", label: "Create" },
  { id: "battle",   icon: "⚔️", label: "Battle" },
  { id: "profile",  icon: "◎",  label: "Profile" },
];

function NavBar({ active, set }) {
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: theme.bgDeep + "F8",
      backdropFilter: "blur(24px)",
      borderTop: `1px solid ${theme.border}`,
      display: "flex", justifyContent: "space-around",
      padding: "8px 0 env(safe-area-inset-bottom, 12px)",
      zIndex: 100,
    }}>
      {NAV.map(n => {
        const on = active === n.id;
        return (
          <button key={n.id} onClick={() => set(n.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "4px 14px", borderRadius: 12, position: "relative",
          }}>
            {n.id === "create"
              ? <span style={{
                  width: 42, height: 42, borderRadius: 14,
                  background: on ? theme.gradPurple : theme.surface,
                  border: `1px solid ${on ? "transparent" : theme.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, color: on ? "#fff" : theme.textSub,
                  marginTop: -16, boxShadow: on ? `0 4px 20px ${theme.purple}55` : "none",
                  transition: "all .2s",
                }}>{n.icon}</span>
              : <>
                  <span style={{
                    fontSize: 18,
                    filter: on ? "none" : "grayscale(0.5) opacity(0.6)",
                    transition: "filter .2s",
                  }}>{n.icon}</span>
                  <span style={{
                    fontSize: 9, fontFamily: font, fontWeight: 700,
                    color: on ? theme.purple : theme.textDim,
                    letterSpacing: 0.5, transition: "color .2s",
                  }}>{n.label}</span>
                  {on && <div style={{
                    position: "absolute", bottom: -1, width: 20, height: 2,
                    background: theme.purple, borderRadius: 2,
                  }} />}
                </>
            }
          </button>
        );
      })}
    </nav>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function Home({ setScreen }) {
  const xpNext = 1000;
  const active = SWAPS.filter(s => s.status === "active");
  const pending = SWAPS.filter(s => s.status === "pending");
  const owing = SWAPS.filter(s => s.from === "me" && s.status === "active");
  const waiting = SWAPS.filter(s => s.from === "partner" && s.status === "active");

  return (
    <div style={{ padding: "0 16px 110px" }}>

      {/* Header */}
      <div style={{ padding: "20px 0 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: font, color: theme.textDim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
            Your couple
          </div>
          <div style={{ fontSize: 24, fontFamily: fontDisp, color: theme.text, fontWeight: 800, letterSpacing: -0.5 }}>
            {ME.avatar} {ME.name} <span style={{ color: theme.textDim }}>×</span> {PARTNER.avatar} {PARTNER.name}
          </div>
        </div>
        <div style={{
          background: theme.surface, borderRadius: 12, padding: "6px 12px",
          border: `1px solid ${theme.border}`, textAlign: "center",
        }}>
          <div style={{ fontSize: 16, fontFamily: fontDisp, color: theme.purple, fontWeight: 800 }}>
            🔥 {ME.streak}
          </div>
          <div style={{ fontSize: 9, fontFamily: font, color: theme.textDim, letterSpacing: 0.5 }}>STREAK</div>
        </div>
      </div>

      {/* XP card */}
      <Card glow={theme.purple} style={{ marginBottom: 14, background: theme.bgDeep }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: font, color: theme.textDim, letterSpacing: 1, textTransform: "uppercase" }}>Season XP</div>
            <div style={{ fontSize: 28, fontFamily: fontDisp, color: theme.text, fontWeight: 800, lineHeight: 1.1 }}>
              {ME.xp} <span style={{ fontSize: 14, color: theme.textDim, fontWeight: 400, fontFamily: font }}>/ {xpNext}</span>
            </div>
          </div>
          <div style={{
            background: theme.gradPurple, borderRadius: 12, padding: "8px 14px",
            fontSize: 13, fontFamily: fontDisp, color: "#fff", fontWeight: 800,
          }}>
            LVL {ME.level}
          </div>
        </div>
        <Bar value={ME.xp} max={xpNext} color={theme.gradPurple} h={7} />
        <div style={{ fontSize: 11, fontFamily: font, color: theme.textDim, marginTop: 8 }}>
          {xpNext - ME.xp} XP to level {ME.level + 1}
        </div>
      </Card>

      {/* At a glance */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { label: "You Owe",  value: owing.length,   color: theme.rose,   icon: "↑" },
          { label: "Waiting",  value: waiting.length,  color: theme.teal,   icon: "↓" },
          { label: "Pending",  value: pending.length,  color: theme.gold,   icon: "⏳" },
        ].map((s, i) => (
          <Card key={i} style={{ padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontFamily: fontDisp, color: s.color, fontWeight: 800 }}>{s.value}</div>
            <div style={{ fontSize: 10, fontFamily: font, color: theme.textDim, marginTop: 3, letterSpacing: 0.4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Active swaps preview */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontFamily: fontDisp, fontSize: 14, fontWeight: 800, color: theme.text }}>Active Swaps</span>
        <button onClick={() => setScreen("swaps")} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 11, fontFamily: font, color: theme.purple, fontWeight: 700,
        }}>See all →</button>
      </div>
      {active.slice(0, 3).map(s => <SwapRow key={s.id} swap={s} />)}

      {/* Quick create CTA */}
      <Btn grad={theme.gradPurple} full onClick={() => setScreen("create")} style={{ marginTop: 6, borderRadius: 16 }}>
        ✦ Create a Swap
      </Btn>
    </div>
  );
}

// ─── Swap row (reused) ────────────────────────────────────────────────────────
function SwapRow({ swap, onAction }) {
  const cat = CATS[swap.cat];
  const isMe = swap.from === "me";
  return (
    <Card style={{ marginBottom: 8, padding: "12px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12, flexShrink: 0,
          background: cat.grad, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, boxShadow: `0 4px 12px ${cat.color}33`,
        }}>{cat.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontFamily: font, fontWeight: 600, color: theme.text }}>{swap.title}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
            <Chip color={isMe ? theme.rose : theme.teal}>{isMe ? `${ME.name} → ${PARTNER.name}` : `${PARTNER.name} → ${ME.name}`}</Chip>
            <span style={{ fontSize: 10, fontFamily: font, color: theme.textDim }}>📅 {swap.deadline}</span>
          </div>
        </div>
        <StatusPill status={swap.status} />
      </div>
      {swap.status === "pending" && onAction && (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <Btn small color={theme.jade} style={{ flex: 1 }} onClick={() => onAction("accept", swap.id)}>✓ Accept</Btn>
          <Btn small outline color={theme.textSub} style={{ flex: 1 }} onClick={() => onAction("counter", swap.id)}>↺ Counter</Btn>
          <Btn small outline color={theme.rose} style={{ flex: 1 }} onClick={() => onAction("decline", swap.id)}>✕</Btn>
        </div>
      )}
      {swap.status === "active" && isMe && onAction && (
        <div style={{ marginTop: 10 }}>
          <Btn small grad={theme.gradTeal} full onClick={() => onAction("complete", swap.id)}>Mark Complete ✓</Btn>
        </div>
      )}
    </Card>
  );
}

function StatusPill({ status }) {
  const map = {
    active:    { label: "Active",    color: theme.teal },
    pending:   { label: "Pending",   color: theme.gold },
    completed: { label: "Done",      color: theme.jade },
    declined:  { label: "Declined",  color: theme.rose },
  };
  const s = map[status] || map.active;
  return <Chip color={s.color}>{s.label}</Chip>;
}

// ─── Swaps list ───────────────────────────────────────────────────────────────
function SwapsList() {
  const [filter, setFilter] = useState("all");
  const tabs = ["all", "active", "pending", "completed"];
  const filtered = filter === "all" ? SWAPS : SWAPS.filter(s => s.status === filter);

  function handleAction(action, id) {
    // will wire to Supabase
    console.log(action, id);
  }

  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ padding: "20px 0 14px" }}>
        <div style={{ fontSize: 11, fontFamily: font, color: theme.textDim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Your</div>
        <div style={{ fontFamily: fontDisp, fontSize: 22, fontWeight: 800, color: theme.text }}>🎟 Swaps</div>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: "flex", gap: 6, background: theme.surface, borderRadius: 14,
        padding: 4, marginBottom: 16,
      }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            flex: 1, padding: "9px 4px", borderRadius: 10, border: "none",
            background: filter === t ? theme.purple : "transparent",
            color: filter === t ? "#fff" : theme.textSub,
            fontSize: 11, fontFamily: font, fontWeight: 700, cursor: "pointer",
            textTransform: "capitalize", transition: "all .2s",
          }}>{t}</button>
        ))}
      </div>

      {filtered.length === 0
        ? <div style={{ textAlign: "center", padding: 40, color: theme.textDim, fontFamily: font, fontSize: 13 }}>
            No swaps here yet.
          </div>
        : filtered.map(s => <SwapRow key={s.id} swap={s} onAction={handleAction} />)
      }
    </div>
  );
}

// ─── Create swap ──────────────────────────────────────────────────────────────
function CreateSwap() {
  const [step, setStep] = useState(1); // 1=direction 2=category 3=details 4=offer
  const [dir, setDir] = useState(null);     // "give" | "want"
  const [cat, setCat] = useState(null);
  const [title, setTitle] = useState("");
  const [offerCat, setOfferCat] = useState(null);
  const [offerTitle, setOfferTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [sent, setSent] = useState(false);

  const templates = {
    errands:   ["Grocery run", "Pick up dry cleaning", "Post office errand"],
    housework: ["Do the laundry", "Clean the bathroom", "Vacuum the living room", "Take out the trash"],
    cooking:   ["Cook dinner tonight", "Make my lunch", "Try a new recipe", "Meal prep Sunday"],
    intimacy:  ["Massage night", "Plan a date night", "Surprise me"],
    fun:       ["Pick the movie", "Plan a weekend activity", "Game night", "Choose a show to binge"],
    sports:    ["30 min jog together", "Gym session", "Yoga class", "Morning walk"],
    kids:      ["Morning school routine", "Bedtime story", "Bath time"],
    pets:      ["Walk the dog", "Clean the litter", "Pet vet appointment"],
  };

  if (sent) return (
    <div style={{ padding: "0 16px 110px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <div style={{ fontFamily: fontDisp, fontSize: 24, fontWeight: 800, color: theme.text, textAlign: "center", marginBottom: 8 }}>
        Swap Sent!
      </div>
      <div style={{ fontFamily: font, fontSize: 13, color: theme.textSub, textAlign: "center", marginBottom: 32 }}>
        Waiting for {PARTNER.name} to respond…
      </div>
      <Btn grad={theme.gradPurple} onClick={() => { setSent(false); setStep(1); setDir(null); setCat(null); setTitle(""); setOfferCat(null); setOfferTitle(""); setDeadline(""); }}>
        Create another
      </Btn>
    </div>
  );

  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ padding: "20px 0 14px" }}>
        <div style={{ fontFamily: fontDisp, fontSize: 22, fontWeight: 800, color: theme.text }}>✦ New Swap</div>
        {/* Step indicator */}
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {[1,2,3,4].map(s => (
            <div key={s} style={{
              flex: 1, height: 3, borderRadius: 3,
              background: step >= s ? theme.purple : theme.border,
              transition: "background .3s",
            }} />
          ))}
        </div>
      </div>

      {/* Step 1: Direction */}
      {step === 1 && (
        <div>
          <div style={{ fontFamily: font, fontSize: 14, color: theme.textSub, marginBottom: 20 }}>
            What kind of swap is this?
          </div>
          {[
            { val: "give", icon: "📤", title: "I'll do something", desc: `You offer a task to ${PARTNER.name}` },
            { val: "want", icon: "📥", title: "I want something done", desc: `You request a task from ${PARTNER.name}` },
          ].map(d => (
            <Card key={d.val} glow={dir === d.val ? theme.purple : undefined}
              style={{ marginBottom: 10, cursor: "pointer", border: `1px solid ${dir === d.val ? theme.purple + "88" : theme.border}` }}
              onClick={() => setDir(d.val)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 28 }}>{d.icon}</span>
                <div>
                  <div style={{ fontFamily: fontDisp, fontSize: 15, fontWeight: 800, color: theme.text }}>{d.title}</div>
                  <div style={{ fontFamily: font, fontSize: 12, color: theme.textSub, marginTop: 2 }}>{d.desc}</div>
                </div>
              </div>
            </Card>
          ))}
          <Btn grad={theme.gradPurple} full disabled={!dir} style={{ marginTop: 8, opacity: dir ? 1 : 0.4 }} onClick={() => dir && setStep(2)}>
            Next →
          </Btn>
        </div>
      )}

      {/* Step 2: Category */}
      {step === 2 && (
        <div>
          <div style={{ fontFamily: font, fontSize: 14, color: theme.textSub, marginBottom: 16 }}>
            Choose a category
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {Object.entries(CATS).map(([key, c]) => (
              <button key={key} onClick={() => setCat(key)} style={{
                padding: "16px 12px", borderRadius: 16, cursor: "pointer",
                background: cat === key ? c.color + "22" : theme.surface,
                border: `1px solid ${cat === key ? c.color + "88" : theme.border}`,
                display: "flex", alignItems: "center", gap: 10, textAlign: "left",
                transition: "all .15s",
              }}>
                <span style={{ fontSize: 24 }}>{c.emoji}</span>
                <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: cat === key ? c.color : theme.textSub }}>
                  {c.label}
                </span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Btn outline color={theme.textSub} onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</Btn>
            <Btn grad={theme.gradPurple} disabled={!cat} style={{ flex: 2, opacity: cat ? 1 : 0.4 }} onClick={() => cat && setStep(3)}>Next →</Btn>
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && cat && (
        <div>
          <div style={{ fontFamily: font, fontSize: 14, color: theme.textSub, marginBottom: 16 }}>
            What exactly? Pick a template or describe it.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {templates[cat].map(t => (
              <button key={t} onClick={() => setTitle(t)} style={{
                padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                background: title === t ? CATS[cat].color + "22" : theme.surface,
                border: `1px solid ${title === t ? CATS[cat].color + "88" : theme.border}`,
                textAlign: "left", fontFamily: font, fontSize: 13, fontWeight: 600,
                color: title === t ? CATS[cat].color : theme.textSub, transition: "all .15s",
              }}>{CATS[cat].emoji} {t}</button>
            ))}
          </div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Or write your own…"
            style={{
              width: "100%", padding: "13px 14px", borderRadius: 12,
              background: theme.bgDeep, border: `1px solid ${theme.border}`,
              color: theme.text, fontSize: 13, fontFamily: font,
              outline: "none", boxSizing: "border-box",
            }}
          />
          <input
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            placeholder="📅 Deadline (optional)"
            style={{
              width: "100%", padding: "13px 14px", borderRadius: 12, marginTop: 8,
              background: theme.bgDeep, border: `1px solid ${theme.border}`,
              color: theme.text, fontSize: 13, fontFamily: font,
              outline: "none", boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Btn outline color={theme.textSub} onClick={() => setStep(2)} style={{ flex: 1 }}>← Back</Btn>
            <Btn grad={theme.gradPurple} disabled={!title} style={{ flex: 2, opacity: title ? 1 : 0.4 }} onClick={() => title && setStep(4)}>Next →</Btn>
          </div>
        </div>
      )}

      {/* Step 4: What you offer in return */}
      {step === 4 && (
        <div>
          <div style={{ fontFamily: fontDisp, fontSize: 16, fontWeight: 800, color: theme.text, marginBottom: 4 }}>
            Your side of the deal
          </div>
          <div style={{ fontFamily: font, fontSize: 13, color: theme.textSub, marginBottom: 16 }}>
            What do you offer in return?
          </div>

          {/* Summary so far */}
          <Card style={{ marginBottom: 16, background: theme.bgDeep }}>
            <div style={{ fontSize: 10, fontFamily: font, color: theme.textDim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
              {dir === "give" ? "You offer" : "You want"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>{cat && CATS[cat].emoji}</span>
              <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: theme.text }}>{title}</span>
            </div>
          </Card>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: theme.textDim, marginBottom: 16 }}>
            ⇅ in exchange for
          </div>

          {/* Offer category */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {Object.entries(CATS).map(([key, c]) => (
              <button key={key} onClick={() => setOfferCat(key)} style={{
                padding: "10px 6px", borderRadius: 12, cursor: "pointer",
                background: offerCat === key ? c.color + "22" : theme.surface,
                border: `1px solid ${offerCat === key ? c.color + "88" : theme.border}`,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                transition: "all .15s",
              }}>
                <span style={{ fontSize: 20 }}>{c.emoji}</span>
                <span style={{ fontSize: 9, fontFamily: font, fontWeight: 600, color: offerCat === key ? c.color : theme.textDim }}>
                  {c.label}
                </span>
              </button>
            ))}
          </div>
          {offerCat && (
            <input
              value={offerTitle}
              onChange={e => setOfferTitle(e.target.value)}
              placeholder={`What ${CATS[offerCat].label} thing?`}
              style={{
                width: "100%", padding: "13px 14px", borderRadius: 12, marginBottom: 12,
                background: theme.bgDeep, border: `1px solid ${theme.border}`,
                color: theme.text, fontSize: 13, fontFamily: font,
                outline: "none", boxSizing: "border-box",
              }}
            />
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn outline color={theme.textSub} onClick={() => setStep(3)} style={{ flex: 1 }}>← Back</Btn>
            <Btn grad={theme.gradPurple} full
              disabled={!offerCat || !offerTitle}
              style={{ flex: 2, opacity: (offerCat && offerTitle) ? 1 : 0.4 }}
              onClick={() => (offerCat && offerTitle) && setSent(true)}
            >
              ⚡ Send Swap
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Battle pass ──────────────────────────────────────────────────────────────
const TIERS = [
  { tier: 1, xp: 0,    reward: "🎟️ 2× Cooking Coupons",      done: true },
  { tier: 2, xp: 200,  reward: "🏆 Custom Badge",             done: true },
  { tier: 3, xp: 500,  reward: "✨ 3× Intimacy Coupons",      done: true },
  { tier: 4, xp: 800,  reward: "⭐ Random Category Pack",     done: false, current: true },
  { tier: 5, xp: 1200, reward: "💎 Custom Coupon Creator",    done: false },
  { tier: 6, xp: 1600, reward: "🎯 Battle Pass Skip Token",   done: false },
  { tier: 7, xp: 2000, reward: "👑 Legendary Coupon Pack",    done: false },
];

function Battle() {
  const [tab, setTab] = useState("pass");
  const tabs = [
    { id: "pass",   label: "Battle Pass" },
    { id: "duel",   label: "Duel" },
    { id: "ranks",  label: "Ranks" },
  ];
  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ padding: "20px 0 14px" }}>
        <div style={{ fontFamily: fontDisp, fontSize: 22, fontWeight: 800, color: theme.text }}>⚔️ Battle Zone</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: theme.surface, borderRadius: 14, padding: 4, marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "10px 4px", borderRadius: 10, border: "none",
            background: tab === t.id ? theme.purple : "transparent",
            color: tab === t.id ? "#fff" : theme.textSub,
            fontSize: 12, fontFamily: font, fontWeight: 700, cursor: "pointer",
            transition: "all .2s",
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "pass" && (
        <div>
          <Card style={{ marginBottom: 14, background: theme.bgDeep }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Chip color={theme.purple}>Season 1 · Spring</Chip>
              <span style={{ fontSize: 11, fontFamily: font, color: theme.textDim }}>18 days left</span>
            </div>
            <Bar value={ME.xp} max={2000} color={theme.gradPurple} h={8} />
            <div style={{ fontSize: 11, fontFamily: font, color: theme.textDim, marginTop: 6 }}>
              {ME.xp} / 2,000 XP — Tier 4 needs {800 - ME.xp} more XP
            </div>
          </Card>
          {TIERS.map(t => (
            <div key={t.tier} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", marginBottom: 6,
              background: t.current ? theme.purple + "15" : theme.surface,
              borderRadius: 14,
              border: `1px solid ${t.current ? theme.purple + "55" : theme.border}`,
              opacity: !t.done && !t.current ? 0.5 : 1,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: t.done ? theme.gradTeal : t.current ? theme.gradPurple : theme.bgDeep,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: t.done ? 14 : 13, color: "#fff", fontFamily: fontDisp, fontWeight: 800,
                border: !t.done && !t.current ? `1px solid ${theme.border}` : "none",
              }}>{t.done ? "✓" : t.tier}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontFamily: font, fontWeight: 600, color: theme.text }}>{t.reward}</div>
                <div style={{ fontSize: 10, fontFamily: font, color: theme.textDim }}>{t.xp} XP</div>
              </div>
              {t.current && <Chip color={theme.purple}>Next ▸</Chip>}
            </div>
          ))}
        </div>
      )}

      {tab === "duel" && (
        <Card style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚔️</div>
          <div style={{ fontFamily: fontDisp, fontSize: 18, fontWeight: 800, color: theme.text, marginBottom: 8 }}>
            Couple Duel
          </div>
          <div style={{ fontFamily: font, fontSize: 13, color: theme.textSub, marginBottom: 20 }}>
            Challenge another couple. Whoever completes the most swaps this week wins.
          </div>
          <Btn grad={theme.gradPurple} full>⚡ Challenge a Couple</Btn>
        </Card>
      )}

      {tab === "ranks" && (
        <div>
          {[
            { rank: 1, couple: "Mia & Tom",     score: 4820, badge: "🥇" },
            { rank: 2, couple: `${ME.name} & ${PARTNER.name}`, score: 4350, badge: "🥈", you: true },
            { rank: 3, couple: "Jin & Yuki",    score: 4100, badge: "🥉" },
            { rank: 4, couple: "Sam & Lee",     score: 3900, badge: "" },
            { rank: 5, couple: "Dev & Priya",   score: 3650, badge: "" },
          ].map(r => (
            <div key={r.rank} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", marginBottom: 6,
              background: r.you ? theme.purple + "15" : theme.surface,
              borderRadius: 14,
              border: `1px solid ${r.you ? theme.purple + "55" : theme.border}`,
            }}>
              <span style={{ fontSize: 20, width: 30, textAlign: "center" }}>{r.badge || `#${r.rank}`}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: r.you ? theme.purple : theme.text }}>
                  {r.couple}
                </span>
              </div>
              <span style={{ fontFamily: fontDisp, fontSize: 15, fontWeight: 800, color: theme.text }}>{r.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function Profile() {
  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ padding: "20px 0 14px" }}>
        <div style={{ fontFamily: fontDisp, fontSize: 22, fontWeight: 800, color: theme.text }}>◎ Profile</div>
      </div>

      {/* Couple card */}
      <Card glow={theme.purple} style={{ marginBottom: 14, background: theme.bgDeep }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36 }}>{ME.avatar}</div>
            <div style={{ fontFamily: fontDisp, fontSize: 13, fontWeight: 800, color: theme.text, marginTop: 4 }}>{ME.name}</div>
            <Chip color={theme.purple} style={{ marginTop: 4 }}>Lvl {ME.level}</Chip>
          </div>
          <div style={{ flex: 1, textAlign: "center", color: theme.textDim, fontSize: 18 }}>×</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36 }}>{PARTNER.avatar}</div>
            <div style={{ fontFamily: fontDisp, fontSize: 13, fontWeight: 800, color: theme.text, marginTop: 4 }}>{PARTNER.name}</div>
            <Chip color={theme.teal} style={{ marginTop: 4 }}>Lvl {PARTNER.level}</Chip>
          </div>
        </div>
        <div style={{
          marginTop: 14, padding: "8px 14px", borderRadius: 10,
          background: theme.purple + "15", border: `1px dashed ${theme.purple}44`,
          textAlign: "center", fontFamily: font, fontSize: 11, color: theme.purple,
          letterSpacing: 0.5,
        }}>
          Couple ID: <strong>SWAP-7X4K2M</strong>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Total Swaps",    value: "24",   color: theme.purple },
          { label: "Completed",      value: "18",   color: theme.jade },
          { label: "Streak",         value: "12🔥", color: theme.gold },
          { label: "District Rank",  value: "#2",   color: theme.teal },
        ].map((s, i) => (
          <Card key={i} style={{ textAlign: "center", padding: "14px 10px" }}>
            <div style={{ fontFamily: fontDisp, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, fontFamily: font, color: theme.textDim, marginTop: 3 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Achievements */}
      <div style={{ fontFamily: fontDisp, fontSize: 14, fontWeight: 800, color: theme.text, marginBottom: 10 }}>
        Achievements
      </div>
      {ACHIEVEMENTS.map(a => (
        <Card key={a.id} style={{ marginBottom: 8, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: a.done ? theme.gradTeal : theme.bgDeep,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, border: `1px solid ${a.done ? "transparent" : theme.border}`,
            }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: theme.text }}>
                {a.title} {a.done && <span style={{ color: theme.jade }}>✓</span>}
              </div>
              <div style={{ fontFamily: font, fontSize: 11, color: theme.textSub, marginTop: 2 }}>{a.desc}</div>
              {!a.done && a.progress !== undefined && (
                <Bar value={a.progress} max={a.target} color={theme.gradPurple} h={4} style={{ marginTop: 6 }} />
              )}
            </div>
            {!a.done && a.progress !== undefined && (
              <span style={{ fontFamily: font, fontSize: 11, color: theme.textDim, flexShrink: 0 }}>
                {a.progress}/{a.target}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── App shell ────────────────────────────────────────────────────────────────
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color: transparent; }
  body { background: #0F1021; }
  input::placeholder { color: #50507A; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: #252740; border-radius: 3px; }
  @keyframes slideUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform:translateY(0); } }
`;

export default function App() {
  const [screen, setScreen] = useState("home");

  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", minHeight: "100vh",
      background: theme.bg, position: "relative", overflow: "hidden",
    }}>
      <style>{globalCss}</style>

      {/* Subtle ambient glow */}
      <div style={{
        position: "fixed", top: -120, left: "50%", transform: "translateX(-50%)",
        width: 500, height: 400, borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse, rgba(155,127,255,0.07) 0%, transparent 70%)",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {screen === "home"    && <Home setScreen={setScreen} />}
        {screen === "swaps"   && <SwapsList />}
        {screen === "create"  && <CreateSwap />}
        {screen === "battle"  && <Battle />}
        {screen === "profile" && <Profile />}
      </div>

      <NavBar active={screen} set={setScreen} />
    </div>
  );
}
