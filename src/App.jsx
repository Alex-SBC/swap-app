import { useState, useEffect, useRef } from "react";

const CATEGORIES = {
  education: { emoji: "📚", color: "#6C5CE7", label: "Education" },
  housework: { emoji: "🏠", color: "#00B894", label: "Housework" },
  cooking: { emoji: "🍳", color: "#FDCB6E", label: "Cooking" },
  sex: { emoji: "🔥", color: "#E17055", label: "Intimacy" },
  fun: { emoji: "🎮", color: "#0984E3", label: "Fun / Hobby" },
  sports: { emoji: "💪", color: "#00CEC9", label: "Sports" },
};

const USERS = {
  me: { name: "You", avatar: "😎", level: 24 },
  partner: { name: "Alex", avatar: "💖", level: 21 },
};

const SAMPLE_COUPONS = [
  { id: 1, cat: "cooking", title: "Cook dinner tonight", from: "me", to: "partner", status: "active", deadline: "Mar 20" },
  { id: 2, cat: "sports", title: "30 min jog together", from: "partner", to: "me", status: "active", deadline: "Mar 22" },
  { id: 3, cat: "housework", title: "Do the laundry", from: "me", to: "partner", status: "completed", deadline: "Mar 15" },
  { id: 4, cat: "sex", title: "Massage night", from: "partner", to: "me", status: "active", deadline: "Mar 25" },
  { id: 5, cat: "fun", title: "Movie marathon pick", from: "me", to: "partner", status: "pending", deadline: "Mar 28" },
  { id: 6, cat: "education", title: "Teach me guitar basics", from: "partner", to: "me", status: "active", deadline: "Apr 1" },
];

const BATTLE_PASS_TIERS = [
  { tier: 1, xp: 0, reward: "🎟️ 2x Cooking Coupons", unlocked: true },
  { tier: 2, xp: 200, reward: "🏆 Custom Badge", unlocked: true },
  { tier: 3, xp: 500, reward: "🔥 3x Intimacy Coupons", unlocked: true },
  { tier: 4, xp: 800, reward: "⭐ Random Category Pack", unlocked: false, current: true },
  { tier: 5, xp: 1200, reward: "💎 Custom Coupon Creator", unlocked: false },
  { tier: 6, xp: 1600, reward: "🎯 Battle Pass Skip Token", unlocked: false },
  { tier: 7, xp: 2000, reward: "👑 Legendary Coupon Pack", unlocked: false },
];

const WEEKLY_GOALS = [
  { id: 1, label: "Cook 2 meals", cat: "cooking", progress: 1, target: 2 },
  { id: 2, label: "2 workout sessions", cat: "sports", progress: 2, target: 2, done: true },
  { id: 3, label: "Clean bathroom", cat: "housework", progress: 0, target: 1 },
  { id: 4, label: "Read 30 pages", cat: "education", progress: 22, target: 30 },
  { id: 5, label: "Plan a date night", cat: "fun", progress: 0, target: 1 },
];

const ACHIEVEMENTS = [
  { id: 1, icon: "🏅", title: "First Trade", desc: "Complete your first coupon trade", unlocked: true, pct: "top 95%" },
  { id: 2, icon: "🔥", title: "7-Day Streak", desc: "Complete goals 7 days in a row", unlocked: true, pct: "top 40%" },
  { id: 3, icon: "👨‍🍳", title: "Master Chef", desc: "Complete 50 cooking coupons", unlocked: false, progress: 32, target: 50, pct: "top 12%" },
  { id: 4, icon: "💪", title: "Iron Couple", desc: "Burn 10,000 calories together", unlocked: false, progress: 6800, target: 10000, pct: "top 8%" },
  { id: 5, icon: "👑", title: "Battle Royale", desc: "Win a couples battle", unlocked: false, progress: 0, target: 1, pct: "top 3%" },
  { id: 6, icon: "🌍", title: "World Class", desc: "Reach top 1% globally", unlocked: false, progress: 0, target: 1, pct: "top 1%" },
];

const LEADERBOARD = [
  { rank: 1, couple: "Mike & Sara", score: 4820, badge: "🥇" },
  { rank: 2, couple: "You & Alex", score: 4350, badge: "🥈", isYou: true },
  { rank: 3, couple: "Jin & Yuki", score: 4100, badge: "🥉" },
  { rank: 4, couple: "Tom & Lisa", score: 3900, badge: "" },
  { rank: 5, couple: "Dev & Priya", score: 3650, badge: "" },
];

const FITNESS_CHALLENGES = [
  { id: 1, title: "Morning Runner", desc: "Run 5km before 8am", reward: "🎟️ 2 Fun Coupons", progress: 3, target: 5, deadline: "This week", cal: 1200 },
  { id: 2, title: "Gym Rat Duo", desc: "10 gym sessions together", reward: "🔥 Intimacy Pack", progress: 6, target: 10, deadline: "This month", cal: 4500 },
  { id: 3, title: "Step Master", desc: "100k steps this week", reward: "⭐ Random Pack", progress: 68000, target: 100000, deadline: "3 days left", cal: 3200 },
];

// ─── Styles ───
const font = `'Outfit', sans-serif`;
const fontDisplay = `'Dela Gothic One', sans-serif`;

const theme = {
  bg: "#0D0D12",
  card: "#16161F",
  cardHover: "#1E1E2A",
  border: "#2A2A3A",
  accent: "#FF3CAC",
  accentAlt: "#784BA0",
  accentGreen: "#2BDE73",
  accentBlue: "#00D4FF",
  text: "#EEEEF0",
  textMuted: "#8888A0",
  textDim: "#555570",
  gradient: "linear-gradient(135deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)",
  gradientGreen: "linear-gradient(135deg, #2BDE73 0%, #00CEC9 100%)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Outfit:wght@300;400;500;600;700;800&display=swap');

  * { margin:0; padding:0; box-sizing:border-box; }
  body { background: ${theme.bg}; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 4px; }

  @keyframes slideUp {
    from { opacity:0; transform: translateY(20px); }
    to { opacity:1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to { opacity:1; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(255,60,172,0.3); }
    50% { box-shadow: 0 0 40px rgba(255,60,172,0.6); }
  }
  @keyframes confetti {
    0% { transform: translateY(0) rotate(0deg); opacity:1; }
    100% { transform: translateY(-60px) rotate(360deg); opacity:0; }
  }
  .stagger-1 { animation: slideUp 0.5s ease both 0.05s; }
  .stagger-2 { animation: slideUp 0.5s ease both 0.1s; }
  .stagger-3 { animation: slideUp 0.5s ease both 0.15s; }
  .stagger-4 { animation: slideUp 0.5s ease both 0.2s; }
  .stagger-5 { animation: slideUp 0.5s ease both 0.25s; }
  .stagger-6 { animation: slideUp 0.5s ease both 0.3s; }
`;

function ProgressBar({ value, max, color, height = 6, style = {} }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ width: "100%", height, background: theme.border, borderRadius: height, overflow: "hidden", ...style }}>
      <div style={{
        width: `${pct}%`, height: "100%", borderRadius: height,
        background: color || theme.gradient,
        transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
      }} />
    </div>
  );
}

function Badge({ children, color = theme.accent, style = {} }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "3px 10px",
      borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: font,
      background: color + "22", color, letterSpacing: 0.5, ...style,
    }}>{children}</span>
  );
}

function NavBar({ active, setScreen }) {
  const items = [
    { id: "home", icon: "⚡", label: "Home" },
    { id: "coupons", icon: "🎟️", label: "Coupons" },
    { id: "battlepass", icon: "🏆", label: "Battle" },
    { id: "fitness", icon: "💪", label: "Fitness" },
    { id: "achieve", icon: "🏅", label: "Ranks" },
  ];
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, background: theme.card + "F0",
      backdropFilter: "blur(20px)", borderTop: `1px solid ${theme.border}`,
      display: "flex", justifyContent: "space-around", padding: "6px 0 env(safe-area-inset-bottom, 10px)",
      zIndex: 100,
    }}>
      {items.map(it => (
        <button key={it.id} onClick={() => setScreen(it.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          padding: "6px 12px", borderRadius: 12,
          transition: "all 0.2s",
        }}>
          <span style={{ fontSize: 20, filter: active === it.id ? "none" : "grayscale(0.6)" }}>{it.icon}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, fontFamily: font, letterSpacing: 0.5,
            color: active === it.id ? theme.accent : theme.textDim,
            transition: "color 0.2s",
          }}>{it.label}</span>
          {active === it.id && <div style={{
            width: 4, height: 4, borderRadius: "50%", background: theme.accent,
            marginTop: 1,
          }} />}
        </button>
      ))}
    </nav>
  );
}

function HomeScreen() {
  const totalXP = 720;
  const nextTierXP = 800;
  return (
    <div style={{ padding: "0 16px 100px" }}>
      {/* Header */}
      <div className="stagger-1" style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 0",
      }}>
        <div>
          <div style={{ fontSize: 13, color: theme.textMuted, fontFamily: font, fontWeight: 500 }}>Welcome back</div>
          <div style={{ fontSize: 22, fontFamily: fontDisplay, color: theme.text, marginTop: 2 }}>
            {USERS.me.avatar} & {USERS.partner.avatar}
          </div>
        </div>
        <div style={{
          background: theme.gradient, borderRadius: 20, padding: "6px 14px",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 12, fontFamily: font, fontWeight: 700, color: "#fff" }}>LVL {USERS.me.level}</span>
        </div>
      </div>

      {/* XP Card */}
      <div className="stagger-2" style={{
        background: theme.gradient, borderRadius: 20, padding: 20,
        position: "relative", overflow: "hidden", marginBottom: 16,
      }}>
        <div style={{
          position: "absolute", top: -30, right: -30, width: 120, height: 120,
          borderRadius: "50%", background: "rgba(255,255,255,0.1)",
        }} />
        <div style={{
          position: "absolute", bottom: -20, left: -20, width: 80, height: 80,
          borderRadius: "50%", background: "rgba(255,255,255,0.08)",
        }} />
        <div style={{ fontSize: 12, fontFamily: font, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: 1.5, textTransform: "uppercase" }}>
          Season XP
        </div>
        <div style={{ fontSize: 36, fontFamily: fontDisplay, color: "#fff", margin: "4px 0 10px" }}>
          {totalXP} <span style={{ fontSize: 16, fontWeight: 400, fontFamily: font, opacity: 0.7 }}>/ {nextTierXP}</span>
        </div>
        <ProgressBar value={totalXP} max={nextTierXP} color="rgba(255,255,255,0.9)" height={8}
          style={{ background: "rgba(255,255,255,0.2)" }} />
        <div style={{ fontSize: 11, fontFamily: font, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>
          {nextTierXP - totalXP} XP to Tier 4 reward unlock
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stagger-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Active", value: "4", sub: "coupons" },
          { label: "Streak", value: "12", sub: "days 🔥" },
          { label: "Rank", value: "#2", sub: "district" },
        ].map((s, i) => (
          <div key={i} style={{
            background: theme.card, borderRadius: 16, padding: "14px 12px",
            border: `1px solid ${theme.border}`, textAlign: "center",
          }}>
            <div style={{ fontSize: 22, fontFamily: fontDisplay, color: theme.text }}>{s.value}</div>
            <div style={{ fontSize: 10, fontFamily: font, color: theme.textMuted, marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 9, fontFamily: font, color: theme.textDim, marginTop: 1 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Weekly Goals */}
      <div className="stagger-4">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontFamily: fontDisplay, fontSize: 15, color: theme.text }}>Weekly Goals</h3>
          <Badge color={theme.accentGreen}>{WEEKLY_GOALS.filter(g => g.done).length}/{WEEKLY_GOALS.length} DONE</Badge>
        </div>
        {WEEKLY_GOALS.map((g, i) => {
          const cat = CATEGORIES[g.cat];
          const pct = g.done ? 100 : Math.round((g.progress / g.target) * 100);
          return (
            <div key={g.id} style={{
              background: theme.card, borderRadius: 14, padding: "12px 14px",
              marginBottom: 8, border: `1px solid ${g.done ? cat.color + "44" : theme.border}`,
              display: "flex", alignItems: "center", gap: 12,
              opacity: g.done ? 0.65 : 1,
            }}>
              <span style={{ fontSize: 22 }}>{cat.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 13, fontFamily: font, fontWeight: 600, color: theme.text,
                  textDecoration: g.done ? "line-through" : "none",
                }}>{g.label}</div>
                <ProgressBar value={g.progress} max={g.target} color={cat.color} height={5}
                  style={{ marginTop: 6 }} />
              </div>
              <span style={{ fontSize: 12, fontFamily: font, fontWeight: 700, color: g.done ? theme.accentGreen : theme.textMuted }}>
                {g.done ? "✓" : `${pct}%`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Partner's Goals (Dual Battle Pass Preview) */}
      <div className="stagger-5" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontFamily: fontDisplay, fontSize: 15, color: theme.text }}>
            {USERS.partner.avatar} Alex's Goals for You
          </h3>
          <Badge color={theme.accentBlue}>DUAL PASS</Badge>
        </div>
        <div style={{
          background: theme.card, borderRadius: 16, padding: 16,
          border: `1px solid ${theme.border}`,
        }}>
          {[
            { label: "Take out trash", cat: "housework", done: true },
            { label: "Back massage", cat: "sex", done: false },
            { label: "Try new pasta recipe", cat: "cooking", done: false },
          ].map((g, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
              borderBottom: i < 2 ? `1px solid ${theme.border}` : "none",
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 6,
                background: g.done ? theme.accentGreen : theme.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: "#fff", flexShrink: 0,
              }}>{g.done ? "✓" : ""}</span>
              <span style={{ fontSize: 13, fontFamily: font, fontWeight: 500, color: theme.text, flex: 1 }}>
                {g.label}
              </span>
              <span style={{ fontSize: 16 }}>{CATEGORIES[g.cat].emoji}</span>
            </div>
          ))}
          <div style={{
            marginTop: 12, padding: "10px 14px", borderRadius: 12,
            background: theme.accentBlue + "15", border: `1px dashed ${theme.accentBlue}44`,
            fontSize: 12, fontFamily: font, color: theme.accentBlue, textAlign: "center",
          }}>
            Complete all → Unlock 🎟️ <strong>3x Fun Coupons</strong> from Alex
          </div>
        </div>
      </div>

      {/* Accountability */}
      <div className="stagger-6" style={{ marginTop: 20 }}>
        <h3 style={{ fontFamily: fontDisplay, fontSize: 15, color: theme.text, marginBottom: 12 }}>⚠️ Accountability</h3>
        <div style={{
          background: "#2D1B1B", borderRadius: 16, padding: 16,
          border: `1px solid #5C2020`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 24 }}>😬</span>
            <div>
              <div style={{ fontSize: 13, fontFamily: font, fontWeight: 600, color: "#FF6B6B" }}>
                Alex missed a deadline!
              </div>
              <div style={{ fontSize: 11, fontFamily: font, color: theme.textMuted }}>
                "Cook dinner tonight" — was due Mar 15
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{
              flex: 1, padding: "8px 12px", borderRadius: 10, border: "none",
              background: "#E17055", color: "#fff", fontSize: 11, fontFamily: font,
              fontWeight: 700, cursor: "pointer", letterSpacing: 0.5,
            }}>🐦 Public Shame</button>
            <button style={{
              flex: 1, padding: "8px 12px", borderRadius: 10, border: `1px solid ${theme.border}`,
              background: "transparent", color: theme.textMuted, fontSize: 11, fontFamily: font,
              fontWeight: 700, cursor: "pointer", letterSpacing: 0.5,
            }}>🎟️ Free Coupon</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CouponsScreen() {
  const [filter, setFilter] = useState("all");
  const [showTrade, setShowTrade] = useState(false);
  const [tradeCat, setTradeCat] = useState("cooking");
  const [tradeDir, setTradeDir] = useState("send");

  const filtered = filter === "all" ? SAMPLE_COUPONS
    : SAMPLE_COUPONS.filter(c => c.status === filter);

  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div className="stagger-1" style={{ padding: "16px 0" }}>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 20, color: theme.text }}>🎟️ Coupons</h2>
        <p style={{ fontSize: 12, fontFamily: font, color: theme.textMuted, marginTop: 4 }}>
          Trade, create & redeem with {USERS.partner.avatar} Alex
        </p>
      </div>

      {/* Filters */}
      <div className="stagger-2" style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", "active", "pending", "completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 16px", borderRadius: 20, border: "none",
            background: filter === f ? theme.accent : theme.card,
            color: filter === f ? "#fff" : theme.textMuted,
            fontSize: 12, fontFamily: font, fontWeight: 600, cursor: "pointer",
            textTransform: "capitalize",
          }}>{f}</button>
        ))}
      </div>

      {/* Trade Button */}
      <button className="stagger-3" onClick={() => setShowTrade(!showTrade)} style={{
        width: "100%", padding: "14px", borderRadius: 16, border: "none",
        background: showTrade ? theme.card : theme.gradient,
        color: "#fff", fontSize: 14, fontFamily: font, fontWeight: 700,
        cursor: "pointer", marginBottom: 16,
        animation: showTrade ? "none" : "glow 2s infinite",
        letterSpacing: 0.5,
      }}>
        {showTrade ? "✕ Close Trade" : "⚡ New Trade"}
      </button>

      {/* Trade Panel */}
      {showTrade && (
        <div style={{
          background: theme.card, borderRadius: 20, padding: 20,
          border: `1px solid ${theme.border}`, marginBottom: 16,
          animation: "slideUp 0.3s ease",
        }}>
          <div style={{ fontSize: 14, fontFamily: font, fontWeight: 700, color: theme.text, marginBottom: 14 }}>
            Create a Trade
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {["send", "request"].map(d => (
              <button key={d} onClick={() => setTradeDir(d)} style={{
                flex: 1, padding: "10px", borderRadius: 12, border: "none",
                background: tradeDir === d ? (d === "send" ? theme.accent + "33" : theme.accentBlue + "33") : theme.bg,
                color: tradeDir === d ? (d === "send" ? theme.accent : theme.accentBlue) : theme.textMuted,
                fontSize: 13, fontFamily: font, fontWeight: 700, cursor: "pointer",
              }}>
                {d === "send" ? "📤 I'll Do" : "📥 I Want"}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button key={key} onClick={() => setTradeCat(key)} style={{
                padding: "10px 6px", borderRadius: 12, border: `2px solid ${tradeCat === key ? cat.color : "transparent"}`,
                background: tradeCat === key ? cat.color + "22" : theme.bg,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                cursor: "pointer",
              }}>
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                <span style={{ fontSize: 10, fontFamily: font, fontWeight: 600, color: tradeCat === key ? cat.color : theme.textMuted }}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>

          <div style={{
            padding: "12px 14px", borderRadius: 12, background: theme.bg,
            border: `1px solid ${theme.border}`, marginBottom: 12,
            fontSize: 13, fontFamily: font, color: theme.textDim,
          }}>
            Describe what you want...
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <div style={{
              flex: 1, padding: "12px 14px", borderRadius: 12, background: theme.bg,
              border: `1px solid ${theme.border}`,
              fontSize: 12, fontFamily: font, color: theme.textDim,
            }}>📅 Set deadline</div>
            <button style={{
              padding: "12px 24px", borderRadius: 12, border: "none",
              background: theme.gradient, color: "#fff", fontSize: 13,
              fontFamily: font, fontWeight: 700, cursor: "pointer",
            }}>Send ⚡</button>
          </div>

          <div style={{
            marginTop: 12, padding: "10px", borderRadius: 10,
            background: theme.accentBlue + "11",
            fontSize: 11, fontFamily: font, color: theme.accentBlue, textAlign: "center",
          }}>
            💡 Random trade: swap 5 random {CATEGORIES[tradeCat].label} for 10 random Housework
          </div>
        </div>
      )}

      {/* Coupon List */}
      {filtered.map((c, i) => {
        const cat = CATEGORIES[c.cat];
        const isFrom = c.from === "me";
        return (
          <div key={c.id} className={`stagger-${Math.min(i + 3, 6)}`} style={{
            background: theme.card, borderRadius: 16, padding: "14px 16px",
            marginBottom: 8, border: `1px solid ${theme.border}`,
            display: "flex", alignItems: "center", gap: 12,
            borderLeft: `3px solid ${cat.color}`,
            opacity: c.status === "completed" ? 0.6 : 1,
          }}>
            <span style={{ fontSize: 28 }}>{cat.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontFamily: font, fontWeight: 600, color: theme.text }}>
                {c.title}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
                <Badge color={isFrom ? theme.accent : theme.accentBlue} style={{ fontSize: 9 }}>
                  {isFrom ? "YOU → ALEX" : "ALEX → YOU"}
                </Badge>
                <span style={{ fontSize: 10, fontFamily: font, color: theme.textDim }}>📅 {c.deadline}</span>
              </div>
            </div>
            <div style={{
              padding: "6px 12px", borderRadius: 10,
              background: c.status === "completed" ? theme.accentGreen + "22" : c.status === "pending" ? "#FDCB6E22" : theme.bg,
              fontSize: 10, fontFamily: font, fontWeight: 700,
              color: c.status === "completed" ? theme.accentGreen : c.status === "pending" ? "#FDCB6E" : theme.textMuted,
              textTransform: "uppercase", letterSpacing: 0.5,
            }}>
              {c.status === "completed" ? "✓ Done" : c.status === "pending" ? "Pending" : "Active"}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BattlePassScreen() {
  const [tab, setTab] = useState("pass");
  const currentXP = 720;
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div className="stagger-1" style={{ padding: "16px 0" }}>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 20, color: theme.text }}>🏆 Battle Zone</h2>
      </div>

      {/* Tabs */}
      <div className="stagger-2" style={{
        display: "flex", gap: 4, background: theme.card, borderRadius: 14,
        padding: 4, marginBottom: 16,
      }}>
        {["pass", "couples", "leaderboard"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "10px", borderRadius: 10, border: "none",
            background: tab === t ? theme.accent : "transparent",
            color: tab === t ? "#fff" : theme.textMuted,
            fontSize: 12, fontFamily: font, fontWeight: 700, cursor: "pointer",
            textTransform: "capitalize",
          }}>{t === "pass" ? "Battle Pass" : t === "couples" ? "Couples War" : "Leaderboard"}</button>
        ))}
      </div>

      {tab === "pass" && (
        <div>
          {/* Season info */}
          <div className="stagger-3" style={{
            background: theme.card, borderRadius: 16, padding: 16,
            border: `1px solid ${theme.border}`, marginBottom: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontFamily: font, fontWeight: 700, color: theme.accent, letterSpacing: 1, textTransform: "uppercase" }}>
                Season 3 — Spring Bloom
              </span>
              <span style={{ fontSize: 11, fontFamily: font, color: theme.textMuted }}>18 days left</span>
            </div>
            <ProgressBar value={currentXP} max={2000} color={null} height={8} />
            <div style={{ fontSize: 11, fontFamily: font, color: theme.textMuted, marginTop: 6 }}>
              {currentXP} / 2,000 XP — Tier 4 in {800 - currentXP} XP
            </div>
          </div>

          {/* Tiers */}
          {BATTLE_PASS_TIERS.map((t, i) => (
            <div key={t.tier} className={`stagger-${Math.min(i + 3, 6)}`} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", marginBottom: 6,
              background: t.current ? theme.accent + "15" : theme.card,
              borderRadius: 14,
              border: `1px solid ${t.current ? theme.accent + "55" : theme.border}`,
              opacity: !t.unlocked && !t.current ? 0.5 : 1,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: t.unlocked ? theme.gradientGreen : t.current ? theme.gradient : theme.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontFamily: fontDisplay, color: "#fff",
                border: t.current ? "none" : `1px solid ${theme.border}`,
              }}>
                {t.unlocked ? "✓" : t.tier}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontFamily: font, fontWeight: 600, color: theme.text }}>
                  {t.reward}
                </div>
                <div style={{ fontSize: 10, fontFamily: font, color: theme.textDim }}>
                  {t.xp} XP required
                </div>
              </div>
              {t.current && (
                <span style={{
                  fontSize: 10, fontFamily: font, fontWeight: 700, color: theme.accent,
                  animation: "pulse 2s infinite",
                }}>NEXT ▸</span>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "couples" && (
        <div>
          <div className="stagger-3" style={{
            background: theme.card, borderRadius: 16, padding: 20,
            border: `1px solid ${theme.border}`, textAlign: "center", marginBottom: 16,
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⚔️</div>
            <div style={{ fontFamily: fontDisplay, fontSize: 16, color: theme.text }}>
              Couples Battle — Week 12
            </div>
            <div style={{ fontSize: 12, fontFamily: font, color: theme.textMuted, marginTop: 4 }}>
              Complete more goals than rival couples to win
            </div>
            <div style={{
              marginTop: 14, display: "inline-flex", padding: "8px 20px", borderRadius: 12,
              background: theme.gradient, fontSize: 13, fontFamily: font,
              fontWeight: 700, color: "#fff",
            }}>
              5 days, 14 hours remaining
            </div>
          </div>
          {LEADERBOARD.map((l, i) => (
            <div key={l.rank} className={`stagger-${Math.min(i + 3, 6)}`} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", marginBottom: 6,
              background: l.isYou ? theme.accent + "15" : theme.card,
              borderRadius: 14,
              border: `1px solid ${l.isYou ? theme.accent + "55" : theme.border}`,
            }}>
              <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{l.badge || `#${l.rank}`}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 13, fontFamily: font, fontWeight: 600,
                  color: l.isYou ? theme.accent : theme.text,
                }}>{l.couple}</div>
              </div>
              <span style={{ fontSize: 14, fontFamily: fontDisplay, color: theme.text }}>{l.score}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "leaderboard" && (
        <div>
          <div className="stagger-3" style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {["District", "City", "National", "World"].map((scope, i) => (
              <button key={scope} style={{
                padding: "6px 14px", borderRadius: 20, border: "none",
                background: i === 0 ? theme.accent : theme.card,
                color: i === 0 ? "#fff" : theme.textMuted,
                fontSize: 11, fontFamily: font, fontWeight: 700, cursor: "pointer",
              }}>{scope}</button>
            ))}
          </div>
          {LEADERBOARD.concat([
            { rank: 6, couple: "Alex & Sam", score: 3400, badge: "" },
            { rank: 7, couple: "Kai & Mika", score: 3200, badge: "" },
          ]).map((l, i) => (
            <div key={l.rank} className={`stagger-${Math.min(i + 3, 6)}`} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", marginBottom: 6,
              background: l.isYou ? theme.accent + "15" : theme.card,
              borderRadius: 14,
              border: `1px solid ${l.isYou ? theme.accent + "55" : theme.border}`,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: l.rank <= 3 ? theme.gradient : theme.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: l.badge ? 18 : 12, fontFamily: fontDisplay, color: "#fff",
                border: l.rank > 3 ? `1px solid ${theme.border}` : "none",
              }}>
                {l.badge || l.rank}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontFamily: font, fontWeight: 600, color: l.isYou ? theme.accent : theme.text }}>
                  {l.couple}
                </div>
              </div>
              <span style={{ fontSize: 14, fontFamily: fontDisplay, color: theme.text }}>{l.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FitnessScreen() {
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div className="stagger-1" style={{ padding: "16px 0" }}>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 20, color: theme.text }}>💪 Fitness Challenges</h2>
        <p style={{ fontSize: 12, fontFamily: font, color: theme.textMuted, marginTop: 4 }}>
          Burn calories, earn coupons
        </p>
      </div>

      {/* Today's Stats */}
      <div className="stagger-2" style={{
        background: theme.gradientGreen, borderRadius: 20, padding: 20,
        position: "relative", overflow: "hidden", marginBottom: 16,
      }}>
        <div style={{
          position: "absolute", top: -20, right: -20, width: 100, height: 100,
          borderRadius: "50%", background: "rgba(255,255,255,0.12)",
        }} />
        <div style={{ fontSize: 11, fontFamily: font, fontWeight: 700, color: "rgba(0,0,0,0.5)", letterSpacing: 1.5, textTransform: "uppercase" }}>
          Today's Burn
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
          <div>
            <div style={{ fontSize: 28, fontFamily: fontDisplay, color: "#fff" }}>487</div>
            <div style={{ fontSize: 10, fontFamily: font, color: "rgba(255,255,255,0.7)" }}>calories</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontFamily: fontDisplay, color: "#fff" }}>8,241</div>
            <div style={{ fontSize: 10, fontFamily: font, color: "rgba(255,255,255,0.7)" }}>steps</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontFamily: fontDisplay, color: "#fff" }}>42</div>
            <div style={{ fontSize: 10, fontFamily: font, color: "rgba(255,255,255,0.7)" }}>min active</div>
          </div>
        </div>
      </div>

      {/* Calendar Battle Pass Preview */}
      <div className="stagger-3" style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: fontDisplay, fontSize: 14, color: theme.text, marginBottom: 10 }}>📅 Weekly Calendar Pass</h3>
        <div style={{
          background: theme.card, borderRadius: 16, padding: 14,
          border: `1px solid ${theme.border}`,
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, textAlign: "center" }}>
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} style={{ fontSize: 10, fontFamily: font, fontWeight: 700, color: theme.textDim, marginBottom: 4 }}>{d}</div>
            ))}
            {[true, true, true, "today", false, false, false].map((status, i) => (
              <div key={i} style={{
                width: "100%", aspectRatio: "1", borderRadius: 10,
                background: status === true ? theme.accentGreen + "33" : status === "today" ? theme.accent + "33" : theme.bg,
                border: `2px solid ${status === true ? theme.accentGreen : status === "today" ? theme.accent : theme.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14,
              }}>
                {status === true ? "✓" : status === "today" ? "⚡" : ""}
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 10, padding: "8px 12px", borderRadius: 10,
            background: theme.bg, fontSize: 11, fontFamily: font, color: theme.textMuted,
          }}>
            Complete all 7 days → Unlock <strong style={{ color: theme.accentGreen }}>🔥 Premium Intimacy Pack</strong>
          </div>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="stagger-4">
        <h3 style={{ fontFamily: fontDisplay, fontSize: 14, color: theme.text, marginBottom: 10 }}>Active Challenges</h3>
        {FITNESS_CHALLENGES.map((ch, i) => {
          const pct = Math.round((ch.progress / ch.target) * 100);
          return (
            <div key={ch.id} style={{
              background: theme.card, borderRadius: 16, padding: 16,
              marginBottom: 10, border: `1px solid ${theme.border}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 14, fontFamily: font, fontWeight: 700, color: theme.text }}>{ch.title}</div>
                  <div style={{ fontSize: 11, fontFamily: font, color: theme.textMuted, marginTop: 2 }}>{ch.desc}</div>
                </div>
                <Badge color={theme.accentGreen}>{ch.deadline}</Badge>
              </div>
              <ProgressBar value={ch.progress} max={ch.target} color={theme.gradientGreen} height={6}
                style={{ marginTop: 10 }} />
              <div style={{
                display: "flex", justifyContent: "space-between", marginTop: 8,
                fontSize: 11, fontFamily: font,
              }}>
                <span style={{ color: theme.textMuted }}>{pct}% — {ch.cal} cal burned</span>
                <span style={{ color: theme.accentGreen, fontWeight: 600 }}>Reward: {ch.reward}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Challenge Someone */}
      <button className="stagger-5" style={{
        width: "100%", padding: "14px", borderRadius: 16, border: "none",
        background: theme.gradient, color: "#fff", fontSize: 14, fontFamily: font,
        fontWeight: 700, cursor: "pointer", marginTop: 8,
        animation: "glow 2s infinite",
      }}>
        ⚡ Challenge Alex to a Fitness Battle Pass
      </button>
    </div>
  );
}

function AchieveScreen() {
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div className="stagger-1" style={{ padding: "16px 0" }}>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 20, color: theme.text }}>🏅 Achievements & Ranks</h2>
      </div>

      {/* Overall Rank */}
      <div className="stagger-2" style={{
        background: theme.card, borderRadius: 20, padding: 20,
        border: `1px solid ${theme.border}`, textAlign: "center", marginBottom: 16,
      }}>
        <div style={{ fontSize: 44 }}>🥈</div>
        <div style={{ fontFamily: fontDisplay, fontSize: 18, color: theme.text, marginTop: 6 }}>
          #2 in Sunset District
        </div>
        <div style={{ fontSize: 12, fontFamily: font, color: theme.textMuted, marginTop: 4 }}>
          Top 5% in San Francisco • Top 12% Nationally
        </div>
        <div style={{
          display: "flex", gap: 8, justifyContent: "center", marginTop: 12, flexWrap: "wrap",
        }}>
          {["District", "City", "State", "National", "World"].map((s, i) => (
            <div key={s} style={{
              padding: "4px 12px", borderRadius: 20, background: i === 0 ? theme.accent + "22" : theme.bg,
              fontSize: 10, fontFamily: font, fontWeight: 700,
              color: i === 0 ? theme.accent : theme.textDim,
            }}>{s}</div>
          ))}
        </div>
      </div>

      {/* Achievement Grid */}
      {ACHIEVEMENTS.map((a, i) => (
        <div key={a.id} className={`stagger-${Math.min(i + 3, 6)}`} style={{
          background: theme.card, borderRadius: 16, padding: "14px 16px",
          marginBottom: 8, border: `1px solid ${a.unlocked ? theme.accentGreen + "44" : theme.border}`,
          display: "flex", alignItems: "center", gap: 14,
          opacity: a.unlocked ? 1 : 0.7,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: a.unlocked ? theme.gradientGreen : theme.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, border: `1px solid ${a.unlocked ? "transparent" : theme.border}`,
            flexShrink: 0,
          }}>{a.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontFamily: font, fontWeight: 700, color: theme.text }}>
              {a.title}
              {a.unlocked && <span style={{ marginLeft: 6, color: theme.accentGreen }}>✓</span>}
            </div>
            <div style={{ fontSize: 11, fontFamily: font, color: theme.textMuted, marginTop: 2 }}>{a.desc}</div>
            {!a.unlocked && a.progress !== undefined && (
              <ProgressBar value={a.progress} max={a.target} color={theme.gradient} height={4}
                style={{ marginTop: 6 }} />
            )}
          </div>
          <Badge color={a.pct.includes("1%") ? "#FFD700" : a.pct.includes("3%") ? theme.accent : theme.accentBlue}>
            {a.pct}
          </Badge>
        </div>
      ))}
    </div>
  );
}

export default function SwapApp() {
  const [screen, setScreen] = useState("home");

  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", minHeight: "100vh",
      background: theme.bg, fontFamily: font, position: "relative",
      overflow: "hidden",
    }}>
      <style>{css}</style>

      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: -100, left: "50%", transform: "translateX(-50%)",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,60,172,0.08) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {screen === "home" && <HomeScreen />}
        {screen === "coupons" && <CouponsScreen />}
        {screen === "battlepass" && <BattlePassScreen />}
        {screen === "fitness" && <FitnessScreen />}
        {screen === "achieve" && <AchieveScreen />}
      </div>

      <NavBar active={screen} setScreen={setScreen} />
    </div>
  );
}