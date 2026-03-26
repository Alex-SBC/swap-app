import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

// ─── Theme ───────────────────────────────────────────────────────────────────
const theme = {
  bg:          "#0F1021",
  bgDeep:      "#090A17",
  surface:     "#161829",
  border:      "#252740",
  purple:      "#9B7FFF",
  teal:        "#2DD4BF",
  gold:        "#F59E0B",
  rose:        "#FB7185",
  jade:        "#34D399",
  text:        "#F0F0FA",
  textSub:     "#9090B0",
  textDim:     "#50507A",
  gradPurple:  "linear-gradient(135deg, #9B7FFF 0%, #6D45E8 100%)",
  gradTeal:    "linear-gradient(135deg, #2DD4BF 0%, #0891B2 100%)",
  gradGold:    "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
  gradRose:    "linear-gradient(135deg, #FB7185 0%, #9B7FFF 100%)",
};

const CATS = {
  errands:   { emoji: "🛍️", label: "Errands",   color: "#F59E0B", grad: "linear-gradient(135deg,#F59E0B,#EF4444)" },
  housework: { emoji: "🏠", label: "Housework", color: "#2DD4BF", grad: "linear-gradient(135deg,#2DD4BF,#0891B2)" },
  cooking:   { emoji: "🍳", label: "Cooking",   color: "#FB7185", grad: "linear-gradient(135deg,#FB7185,#9B7FFF)" },
  intimacy:  { emoji: "✨", label: "Intimacy",  color: "#9B7FFF", grad: "linear-gradient(135deg,#9B7FFF,#6D45E8)" },
  fun:       { emoji: "🎲", label: "Fun",       color: "#34D399", grad: "linear-gradient(135deg,#34D399,#2DD4BF)" },
  sports:    { emoji: "🏃", label: "Sports",    color: "#2DD4BF", grad: "linear-gradient(135deg,#2DD4BF,#0891B2)" },
  kids:      { emoji: "🧒", label: "Kids",      color: "#F59E0B", grad: "linear-gradient(135deg,#F59E0B,#EF4444)" },
  pets:      { emoji: "🐾", label: "Pets",      color: "#FB7185", grad: "linear-gradient(135deg,#FB7185,#9B7FFF)" },
};

const TEMPLATES = {
  errands:   ["Grocery run", "Pick up dry cleaning", "Post office errand"],
  housework: ["Do the laundry", "Clean the bathroom", "Vacuum the living room", "Take out the trash"],
  cooking:   ["Cook dinner tonight", "Make my lunch", "Try a new recipe", "Meal prep Sunday"],
  intimacy:  ["Massage night", "Plan a date night", "Surprise me"],
  fun:       ["Pick the movie", "Plan a weekend activity", "Game night", "Choose a show to binge"],
  sports:    ["30 min jog together", "Gym session", "Yoga class", "Morning walk"],
  kids:      ["Morning school routine", "Bedtime story", "Bath time"],
  pets:      ["Walk the dog", "Clean the litter", "Pet vet appointment"],
};

const AVATARS = ["🌙","⚡","🌊","🔥","🌸","🦋","🎯","🌈","🦊","🐺","🌟","💎"];

const XP_ACTIONS = { created: 5, accepted: 5, completed: 20 };
const XP_PER_LEVEL = [0, 50, 100, 150, 200, 250, 300];

const font     = `'Plus Jakarta Sans', 'Inter', sans-serif`;
const fontDisp = `'Syne', 'Plus Jakarta Sans', sans-serif`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function genCoupleId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "SWAP-";
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function xpForLevel(xp) {
  let level = 1;
  let accumulated = 0;
  for (let i = 0; i < XP_PER_LEVEL.length; i++) {
    accumulated += XP_PER_LEVEL[i] || 300;
    if (xp < accumulated) return { level, nextLevelXp: accumulated, currentXp: xp };
    level++;
  }
  return { level, nextLevelXp: accumulated + 300, currentXp: xp };
}

// ─── Primitives ───────────────────────────────────────────────────────────────
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

function Card({ children, style = {}, glow, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: theme.surface, borderRadius: 18, padding: 16,
      border: `1px solid ${glow ? glow + "55" : theme.border}`,
      boxShadow: glow ? `0 0 24px ${glow}18` : "none",
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}>{children}</div>
  );
}

function Btn({ children, grad, color, outline, small, full, onClick, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      padding: small ? "8px 14px" : "13px 20px",
      width: full ? "100%" : undefined,
      borderRadius: 14, border: outline ? `1px solid ${color || theme.border}` : "none",
      background: outline ? "transparent" : (grad || color || theme.purple),
      color: outline ? (color || theme.textSub) : "#fff",
      fontSize: small ? 12 : 14, fontFamily: font, fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer", letterSpacing: 0.3,
      opacity: disabled ? 0.4 : 1, transition: "opacity .15s",
      ...style,
    }}>{children}</button>
  );
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
      background: theme.surface, border: `1px solid ${theme.purple}55`,
      borderRadius: 14, padding: "12px 20px", zIndex: 200,
      fontFamily: font, fontSize: 13, fontWeight: 600, color: theme.text,
      boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
      animation: "slideDown .3s ease",
    }}>{msg}</div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "home",    icon: "✦",  label: "Home" },
  { id: "swaps",   icon: "🎟", label: "Swaps" },
  { id: "create",  icon: "＋", label: "Create" },
  { id: "battle",  icon: "⚔️", label: "Battle" },
  { id: "profile", icon: "◎",  label: "Profile" },
];

function NavBar({ active, set }) {
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: theme.bgDeep + "F8", backdropFilter: "blur(24px)",
      borderTop: `1px solid ${theme.border}`,
      display: "flex", justifyContent: "space-around",
      padding: "8px 0 env(safe-area-inset-bottom, 12px)", zIndex: 100,
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
                  width: 44, height: 44, borderRadius: 14,
                  background: on ? theme.gradPurple : theme.surface,
                  border: `1px solid ${on ? "transparent" : theme.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, color: on ? "#fff" : theme.textSub,
                  marginTop: -18, boxShadow: on ? `0 4px 20px ${theme.purple}55` : "none",
                  transition: "all .2s",
                }}>{n.icon}</span>
              : <>
                  <span style={{ fontSize: 18, filter: on ? "none" : "grayscale(0.5) opacity(0.6)", transition: "filter .2s" }}>{n.icon}</span>
                  <span style={{ fontSize: 9, fontFamily: font, fontWeight: 700, color: on ? theme.purple : theme.textDim, letterSpacing: 0.5 }}>{n.label}</span>
                  {on && <div style={{ position: "absolute", bottom: -1, width: 20, height: 2, background: theme.purple, borderRadius: 2 }} />}
                </>
            }
          </button>
        );
      })}
    </nav>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState("welcome"); // welcome | create | join | waiting
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [coupleId, setCoupleId] = useState("");
  const [inputId, setInputId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true); setError("");
    try {
      const id = genCoupleId();
      const { error: e1 } = await supabase.from("couples").insert({
        id, user_a_name: name.trim(), user_a_avatar: avatar, linked: false,
      });
      if (e1) throw e1;
      const { data: user, error: e2 } = await supabase.from("users").insert({
        name: name.trim(), avatar, couple_id: id, role: "a", xp: 0, level: 1,
      }).select().single();
      if (e2) throw e2;
      localStorage.setItem("swap_user_id", user.id);
      localStorage.setItem("swap_couple_id", id);
      localStorage.setItem("swap_role", "a");
      setCoupleId(id);
      setStep("waiting");
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  async function handleJoin() {
    if (!name.trim() || !inputId.trim()) return;
    setLoading(true); setError("");
    try {
      const id = inputId.trim().toUpperCase();
      const { data: couple, error: e1 } = await supabase.from("couples").select("*").eq("id", id).single();
      if (e1 || !couple) { setError("Couple ID not found. Check with your partner."); setLoading(false); return; }
      if (couple.linked) { setError("This couple is already linked."); setLoading(false); return; }

      const { error: e2 } = await supabase.from("couples").update({
        user_b_name: name.trim(), user_b_avatar: avatar, linked: true,
      }).eq("id", id);
      if (e2) throw e2;

      const { data: user, error: e3 } = await supabase.from("users").insert({
        name: name.trim(), avatar, couple_id: id, role: "b", xp: 0, level: 1,
      }).select().single();
      if (e3) throw e3;

      localStorage.setItem("swap_user_id", user.id);
      localStorage.setItem("swap_couple_id", id);
      localStorage.setItem("swap_role", "b");
      onDone();
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  // Poll for partner joining (user A waiting)
  useEffect(() => {
    if (step !== "waiting") return;
    const id = coupleId;
    const channel = supabase
      .channel("couple-link-" + id)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "couples", filter: `id=eq.${id}` },
        (payload) => { if (payload.new.linked) onDone(); }
      ).subscribe();
    return () => supabase.removeChannel(channel);
  }, [step, coupleId, onDone]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px 24px 48px",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <div style={{ fontFamily: fontDisp, fontSize: 42, fontWeight: 800, color: theme.text, letterSpacing: -1 }}>
          SWAP
        </div>
        <div style={{ fontFamily: font, fontSize: 13, color: theme.textDim, marginTop: 4 }}>
          gamified relationship trading
        </div>
      </div>

      {step === "welcome" && (
        <div style={{ width: "100%", maxWidth: 360 }}>
          <Btn grad={theme.gradPurple} full onClick={() => setStep("create")} style={{ marginBottom: 12 }}>
            ✦ Create a couple
          </Btn>
          <Btn outline color={theme.textSub} full onClick={() => setStep("join")}>
            Join with a code
          </Btn>
        </div>
      )}

      {(step === "create" || step === "join") && (
        <div style={{ width: "100%", maxWidth: 360 }}>
          <div style={{ fontFamily: fontDisp, fontSize: 18, fontWeight: 800, color: theme.text, marginBottom: 4 }}>
            {step === "create" ? "Create your couple" : "Join your partner"}
          </div>
          <div style={{ fontFamily: font, fontSize: 13, color: theme.textSub, marginBottom: 24 }}>
            {step === "create" ? "You'll get a code to share with your partner." : "Enter the code your partner shared with you."}
          </div>

          {/* Name */}
          <div style={{ fontFamily: font, fontSize: 11, color: theme.textDim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Your name</div>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: "100%", padding: "13px 14px", borderRadius: 12, marginBottom: 16,
              background: theme.bgDeep, border: `1px solid ${theme.border}`,
              color: theme.text, fontSize: 14, fontFamily: font, outline: "none", boxSizing: "border-box",
            }}
          />

          {/* Avatar */}
          <div style={{ fontFamily: font, fontSize: 11, color: theme.textDim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Pick an avatar</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 20 }}>
            {AVATARS.map(a => (
              <button key={a} onClick={() => setAvatar(a)} style={{
                fontSize: 24, padding: "8px", borderRadius: 12, border: "none",
                background: avatar === a ? theme.purple + "33" : theme.surface,
                outline: avatar === a ? `2px solid ${theme.purple}` : "none",
                cursor: "pointer", transition: "all .15s",
              }}>{a}</button>
            ))}
          </div>

          {/* Join: couple ID input */}
          {step === "join" && (
            <>
              <div style={{ fontFamily: font, fontSize: 11, color: theme.textDim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Couple ID</div>
              <input
                value={inputId} onChange={e => setInputId(e.target.value.toUpperCase())}
                placeholder="SWAP-XXXXXX"
                style={{
                  width: "100%", padding: "13px 14px", borderRadius: 12, marginBottom: 16,
                  background: theme.bgDeep, border: `1px solid ${theme.border}`,
                  color: theme.text, fontSize: 14, fontFamily: font, outline: "none",
                  boxSizing: "border-box", letterSpacing: 2,
                }}
              />
            </>
          )}

          {error && <div style={{ color: theme.rose, fontFamily: font, fontSize: 12, marginBottom: 12 }}>{error}</div>}

          <div style={{ display: "flex", gap: 10 }}>
            <Btn outline color={theme.textSub} onClick={() => setStep("welcome")} style={{ flex: 1 }}>← Back</Btn>
            <Btn grad={theme.gradPurple} style={{ flex: 2 }}
              disabled={loading || !name.trim() || (step === "join" && !inputId.trim())}
              onClick={step === "create" ? handleCreate : handleJoin}
            >
              {loading ? "…" : step === "create" ? "Create ✦" : "Join ⚡"}
            </Btn>
          </div>
        </div>
      )}

      {step === "waiting" && (
        <div style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
          <div style={{ fontFamily: fontDisp, fontSize: 20, fontWeight: 800, color: theme.text, marginBottom: 8 }}>
            Waiting for your partner
          </div>
          <div style={{ fontFamily: font, fontSize: 13, color: theme.textSub, marginBottom: 28 }}>
            Share this code with them:
          </div>
          <div style={{
            fontFamily: fontDisp, fontSize: 28, fontWeight: 800, color: theme.purple,
            letterSpacing: 4, padding: "20px", borderRadius: 18,
            background: theme.surface, border: `1px solid ${theme.purple}44`,
            marginBottom: 28,
          }}>{coupleId}</div>
          <div style={{ fontFamily: font, fontSize: 12, color: theme.textDim }}>
            This page will update automatically when they join.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function Home({ user, partner, couple, swaps, setScreen }) {
  const { level, nextLevelXp, currentXp } = xpForLevel(user?.xp || 0);
  const active = swaps.filter(s => s.status === "active");
  const pending = swaps.filter(s => s.status === "pending" && s.created_by !== user?.role);
  const owing = swaps.filter(s => s.status === "active" && s.created_by !== user?.role);
  const waiting = swaps.filter(s => s.status === "active" && s.created_by === user?.role);

  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ padding: "20px 0 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: font, color: theme.textDim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Your couple</div>
          <div style={{ fontSize: 22, fontFamily: fontDisp, color: theme.text, fontWeight: 800, letterSpacing: -0.5 }}>
            {user?.avatar} {user?.name} <span style={{ color: theme.textDim }}>×</span> {partner?.avatar || "?"} {partner?.name || "…"}
          </div>
        </div>
        <Card style={{ padding: "8px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 16, fontFamily: fontDisp, color: theme.purple, fontWeight: 800 }}>LVL {level}</div>
          <div style={{ fontSize: 9, fontFamily: font, color: theme.textDim, letterSpacing: 0.5 }}>LEVEL</div>
        </Card>
      </div>

      {/* XP */}
      <Card glow={theme.purple} style={{ marginBottom: 14, background: theme.bgDeep }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: font, color: theme.textDim, letterSpacing: 1, textTransform: "uppercase" }}>Season XP</div>
            <div style={{ fontSize: 28, fontFamily: fontDisp, color: theme.text, fontWeight: 800, lineHeight: 1.1 }}>
              {currentXp} <span style={{ fontSize: 14, color: theme.textDim, fontWeight: 400, fontFamily: font }}>/ {nextLevelXp}</span>
            </div>
          </div>
        </div>
        <Bar value={currentXp} max={nextLevelXp} color={theme.gradPurple} h={7} />
        <div style={{ fontSize: 11, fontFamily: font, color: theme.textDim, marginTop: 8 }}>
          {nextLevelXp - currentXp} XP to level {level + 1}
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { label: "You Owe",  value: owing.length,   color: theme.rose },
          { label: "Waiting",  value: waiting.length,  color: theme.teal },
          { label: "Pending",  value: pending.length,  color: theme.gold },
        ].map((s, i) => (
          <Card key={i} style={{ padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontFamily: fontDisp, color: s.color, fontWeight: 800 }}>{s.value}</div>
            <div style={{ fontSize: 10, fontFamily: font, color: theme.textDim, marginTop: 3 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Pending incoming — needs action */}
      {pending.length > 0 && (
        <>
          <div style={{ fontFamily: fontDisp, fontSize: 14, fontWeight: 800, color: theme.text, marginBottom: 10 }}>
            ⚡ Needs your response
          </div>
          {pending.map(s => <SwapRow key={s.id} swap={s} user={user} partner={partner} />)}
        </>
      )}

      {/* Active */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, marginTop: 8 }}>
        <span style={{ fontFamily: fontDisp, fontSize: 14, fontWeight: 800, color: theme.text }}>Active Swaps</span>
        <button onClick={() => setScreen("swaps")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontFamily: font, color: theme.purple, fontWeight: 700 }}>See all →</button>
      </div>
      {active.length === 0
        ? <Card style={{ textAlign: "center", padding: 24, color: theme.textDim, fontFamily: font, fontSize: 13 }}>No active swaps yet.</Card>
        : active.slice(0, 3).map(s => <SwapRow key={s.id} swap={s} user={user} partner={partner} compact />)
      }

      <Btn grad={theme.gradPurple} full onClick={() => setScreen("create")} style={{ marginTop: 12, borderRadius: 16 }}>
        ✦ Create a Swap
      </Btn>
    </div>
  );
}

// ─── Swap Row ─────────────────────────────────────────────────────────────────
function SwapRow({ swap, user, partner, compact, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const isCreator = swap.created_by === user?.role;
  const cat = CATS[swap.want_cat] || CATS.fun;
  const offerCat = CATS[swap.offer_cat] || CATS.fun;

  async function handleAction(action) {
    setLoading(true);
    if (action === "accept") {
      await supabase.from("swaps").update({ status: "active" }).eq("id", swap.id);
      // XP for both
      await supabase.from("users").update({ xp: (user.xp || 0) + XP_ACTIONS.accepted }).eq("id", user.id);
    } else if (action === "decline") {
      await supabase.from("swaps").update({ status: "declined" }).eq("id", swap.id);
    } else if (action === "complete") {
      await supabase.from("swaps").update({ status: "completed" }).eq("id", swap.id);
      await supabase.from("users").update({ xp: (user.xp || 0) + XP_ACTIONS.completed }).eq("id", user.id);
    }
    setLoading(false);
    onRefresh && onRefresh();
  }

  return (
    <Card style={{ marginBottom: 8, padding: "12px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: cat.grad, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, boxShadow: `0 4px 12px ${cat.color}33`,
        }}>{cat.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontFamily: font, fontWeight: 600, color: theme.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {swap.want_title}
          </div>
          {!compact && (
            <div style={{ fontSize: 11, fontFamily: font, color: theme.textDim, marginTop: 2 }}>
              {offerCat.emoji} in exchange for: {swap.offer_title}
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
            <Chip color={isCreator ? theme.rose : theme.teal} style={{ fontSize: 9 }}>
              {isCreator ? `${user?.name} → ${partner?.name || "partner"}` : `${partner?.name || "partner"} → ${user?.name}`}
            </Chip>
            {swap.deadline && <span style={{ fontSize: 10, fontFamily: font, color: theme.textDim }}>📅 {swap.deadline}</span>}
          </div>
        </div>
        <StatusPill status={swap.status} />
      </div>

      {/* Actions */}
      {swap.status === "pending" && !isCreator && (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <Btn small color={theme.jade} disabled={loading} style={{ flex: 1, background: theme.jade }} onClick={() => handleAction("accept")}>✓ Accept</Btn>
          <Btn small outline color={theme.rose} disabled={loading} style={{ flex: 1 }} onClick={() => handleAction("decline")}>✕ Decline</Btn>
        </div>
      )}
      {swap.status === "active" && !isCreator && (
        <div style={{ marginTop: 10 }}>
          <Btn small grad={theme.gradTeal} full disabled={loading} onClick={() => handleAction("complete")}>✓ Mark Complete</Btn>
        </div>
      )}
    </Card>
  );
}

function StatusPill({ status }) {
  const map = {
    active:    { label: "Active",   color: theme.teal },
    pending:   { label: "Pending",  color: theme.gold },
    completed: { label: "Done",     color: theme.jade },
    declined:  { label: "Declined", color: theme.rose },
  };
  const s = map[status] || map.active;
  return <Chip color={s.color}>{s.label}</Chip>;
}

// ─── Swaps list ───────────────────────────────────────────────────────────────
function SwapsList({ swaps, user, partner, onRefresh }) {
  const [filter, setFilter] = useState("all");
  const tabs = ["all", "active", "pending", "completed"];
  const filtered = filter === "all" ? swaps : swaps.filter(s => s.status === filter);

  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ padding: "20px 0 14px" }}>
        <div style={{ fontSize: 11, fontFamily: font, color: theme.textDim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Your</div>
        <div style={{ fontFamily: fontDisp, fontSize: 22, fontWeight: 800, color: theme.text }}>🎟 Swaps</div>
      </div>
      <div style={{ display: "flex", gap: 4, background: theme.surface, borderRadius: 14, padding: 4, marginBottom: 16 }}>
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
        ? <div style={{ textAlign: "center", padding: 40, color: theme.textDim, fontFamily: font, fontSize: 13 }}>Nothing here yet.</div>
        : filtered.map(s => <SwapRow key={s.id} swap={s} user={user} partner={partner} onRefresh={onRefresh} />)
      }
    </div>
  );
}

// ─── Create Swap ──────────────────────────────────────────────────────────────
function CreateSwap({ user, coupleId, onDone }) {
  const [step, setStep] = useState(1);
  const [wantCat, setWantCat] = useState(null);
  const [wantTitle, setWantTitle] = useState("");
  const [offerCat, setOfferCat] = useState(null);
  const [offerTitle, setOfferTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!wantCat || !wantTitle || !offerCat || !offerTitle) return;
    setLoading(true);
    await supabase.from("swaps").insert({
      couple_id: coupleId,
      created_by: user.role,
      want_cat: wantCat,
      want_title: wantTitle.trim(),
      offer_cat: offerCat,
      offer_title: offerTitle.trim(),
      deadline: deadline.trim() || null,
      status: "pending",
    });
    await supabase.from("users").update({ xp: (user.xp || 0) + XP_ACTIONS.created }).eq("id", user.id);
    setLoading(false);
    setSent(true);
    setTimeout(onDone, 2000);
  }

  if (sent) return (
    <div style={{ padding: "0 16px 110px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <div style={{ fontFamily: fontDisp, fontSize: 24, fontWeight: 800, color: theme.text, textAlign: "center", marginBottom: 8 }}>Swap Sent!</div>
      <div style={{ fontFamily: font, fontSize: 13, color: theme.textSub, textAlign: "center" }}>Waiting for your partner to respond…</div>
    </div>
  );

  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ padding: "20px 0 14px" }}>
        <div style={{ fontFamily: fontDisp, fontSize: 22, fontWeight: 800, color: theme.text }}>✦ New Swap</div>
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 3, background: step >= s ? theme.purple : theme.border, transition: "background .3s" }} />
          ))}
        </div>
      </div>

      {/* Step 1: What you want */}
      {step === 1 && (
        <div>
          <div style={{ fontFamily: fontDisp, fontSize: 16, fontWeight: 800, color: theme.text, marginBottom: 4 }}>What do you want done?</div>
          <div style={{ fontFamily: font, fontSize: 13, color: theme.textSub, marginBottom: 16 }}>Choose a category</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {Object.entries(CATS).map(([key, c]) => (
              <button key={key} onClick={() => { setWantCat(key); setWantTitle(""); }} style={{
                padding: "14px 12px", borderRadius: 16, cursor: "pointer",
                background: wantCat === key ? c.color + "22" : theme.surface,
                border: `1px solid ${wantCat === key ? c.color + "88" : theme.border}`,
                display: "flex", alignItems: "center", gap: 10, textAlign: "left", transition: "all .15s",
              }}>
                <span style={{ fontSize: 22 }}>{c.emoji}</span>
                <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: wantCat === key ? c.color : theme.textSub }}>{c.label}</span>
              </button>
            ))}
          </div>
          {wantCat && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                {TEMPLATES[wantCat].map(t => (
                  <button key={t} onClick={() => setWantTitle(t)} style={{
                    padding: "11px 14px", borderRadius: 12, cursor: "pointer",
                    background: wantTitle === t ? CATS[wantCat].color + "22" : theme.surface,
                    border: `1px solid ${wantTitle === t ? CATS[wantCat].color + "88" : theme.border}`,
                    textAlign: "left", fontFamily: font, fontSize: 13, fontWeight: 600,
                    color: wantTitle === t ? CATS[wantCat].color : theme.textSub, transition: "all .15s",
                  }}>{CATS[wantCat].emoji} {t}</button>
                ))}
              </div>
              <input value={wantTitle} onChange={e => setWantTitle(e.target.value)} placeholder="Or write your own…"
                style={{ width: "100%", padding: "13px 14px", borderRadius: 12, background: theme.bgDeep, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 13, fontFamily: font, outline: "none", boxSizing: "border-box", marginBottom: 4 }} />
            </>
          )}
          <Btn grad={theme.gradPurple} full disabled={!wantCat || !wantTitle} style={{ marginTop: 14 }} onClick={() => setStep(2)}>Next →</Btn>
        </div>
      )}

      {/* Step 2: What you offer */}
      {step === 2 && (
        <div>
          <div style={{ fontFamily: fontDisp, fontSize: 16, fontWeight: 800, color: theme.text, marginBottom: 4 }}>What do you offer in return?</div>
          <div style={{ fontFamily: font, fontSize: 13, color: theme.textSub, marginBottom: 16 }}>Choose a category</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {Object.entries(CATS).map(([key, c]) => (
              <button key={key} onClick={() => { setOfferCat(key); setOfferTitle(""); }} style={{
                padding: "14px 12px", borderRadius: 16, cursor: "pointer",
                background: offerCat === key ? c.color + "22" : theme.surface,
                border: `1px solid ${offerCat === key ? c.color + "88" : theme.border}`,
                display: "flex", alignItems: "center", gap: 10, textAlign: "left", transition: "all .15s",
              }}>
                <span style={{ fontSize: 22 }}>{c.emoji}</span>
                <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: offerCat === key ? c.color : theme.textSub }}>{c.label}</span>
              </button>
            ))}
          </div>
          {offerCat && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                {TEMPLATES[offerCat].map(t => (
                  <button key={t} onClick={() => setOfferTitle(t)} style={{
                    padding: "11px 14px", borderRadius: 12, cursor: "pointer",
                    background: offerTitle === t ? CATS[offerCat].color + "22" : theme.surface,
                    border: `1px solid ${offerTitle === t ? CATS[offerCat].color + "88" : theme.border}`,
                    textAlign: "left", fontFamily: font, fontSize: 13, fontWeight: 600,
                    color: offerTitle === t ? CATS[offerCat].color : theme.textSub, transition: "all .15s",
                  }}>{CATS[offerCat].emoji} {t}</button>
                ))}
              </div>
              <input value={offerTitle} onChange={e => setOfferTitle(e.target.value)} placeholder="Or write your own…"
                style={{ width: "100%", padding: "13px 14px", borderRadius: 12, background: theme.bgDeep, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 13, fontFamily: font, outline: "none", boxSizing: "border-box" }} />
            </>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Btn outline color={theme.textSub} onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</Btn>
            <Btn grad={theme.gradPurple} disabled={!offerCat || !offerTitle} style={{ flex: 2 }} onClick={() => setStep(3)}>Next →</Btn>
          </div>
        </div>
      )}

      {/* Step 3: Review + deadline */}
      {step === 3 && (
        <div>
          <div style={{ fontFamily: fontDisp, fontSize: 16, fontWeight: 800, color: theme.text, marginBottom: 16 }}>Review your swap</div>

          <Card style={{ marginBottom: 12, background: theme.bgDeep }}>
            <div style={{ fontSize: 10, fontFamily: font, color: theme.textDim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>You want</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>{wantCat && CATS[wantCat].emoji}</span>
              <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: theme.text }}>{wantTitle}</span>
            </div>
          </Card>

          <div style={{ textAlign: "center", color: theme.textDim, fontSize: 18, marginBottom: 12 }}>⇅ in exchange for</div>

          <Card style={{ marginBottom: 16, background: theme.bgDeep }}>
            <div style={{ fontSize: 10, fontFamily: font, color: theme.textDim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>You offer</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>{offerCat && CATS[offerCat].emoji}</span>
              <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: theme.text }}>{offerTitle}</span>
            </div>
          </Card>

          <input value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="📅 Deadline, e.g. This Friday (optional)"
            style={{ width: "100%", padding: "13px 14px", borderRadius: 12, marginBottom: 16, background: theme.bgDeep, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 13, fontFamily: font, outline: "none", boxSizing: "border-box" }} />

          <div style={{ display: "flex", gap: 10 }}>
            <Btn outline color={theme.textSub} onClick={() => setStep(2)} style={{ flex: 1 }}>← Back</Btn>
            <Btn grad={theme.gradPurple} disabled={loading} style={{ flex: 2 }} onClick={handleSend}>
              {loading ? "Sending…" : "⚡ Send Swap"}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Battle (static for MVP) ──────────────────────────────────────────────────
function Battle({ user }) {
  const { level, nextLevelXp, currentXp } = xpForLevel(user?.xp || 0);
  const TIERS = [
    { tier: 1, xp: 0,    reward: "🎟️ 2× Cooking Coupons",   done: currentXp >= 0 },
    { tier: 2, xp: 50,   reward: "🏆 Custom Badge",          done: currentXp >= 50 },
    { tier: 3, xp: 150,  reward: "✨ 3× Intimacy Coupons",   done: currentXp >= 150, current: currentXp >= 50 && currentXp < 150 },
    { tier: 4, xp: 300,  reward: "⭐ Random Category Pack",  done: false, current: currentXp >= 150 && currentXp < 300 },
    { tier: 5, xp: 500,  reward: "💎 Custom Coupon Creator", done: false },
    { tier: 6, xp: 800,  reward: "👑 Legendary Coupon Pack", done: false },
  ];

  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ padding: "20px 0 14px" }}>
        <div style={{ fontFamily: fontDisp, fontSize: 22, fontWeight: 800, color: theme.text }}>⚔️ Battle Pass</div>
      </div>
      <Card style={{ marginBottom: 14, background: theme.bgDeep }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <Chip color={theme.purple}>Season 1 · Spring</Chip>
          <span style={{ fontSize: 11, fontFamily: font, color: theme.textDim }}>XP: {currentXp}</span>
        </div>
        <Bar value={currentXp} max={800} color={theme.gradPurple} h={8} />
        <div style={{ fontSize: 11, fontFamily: font, color: theme.textDim, marginTop: 6 }}>
          Earn XP by creating and completing swaps
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
            fontSize: 13, color: "#fff", fontFamily: fontDisp, fontWeight: 800,
            border: !t.done && !t.current ? `1px solid ${theme.border}` : "none",
          }}>{t.done ? "✓" : t.tier}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontFamily: font, fontWeight: 600, color: theme.text }}>{t.reward}</div>
            <div style={{ fontSize: 10, fontFamily: font, color: theme.textDim }}>{t.xp} XP required</div>
          </div>
          {t.current && <Chip color={theme.purple}>Next ▸</Chip>}
        </div>
      ))}
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function Profile({ user, partner, couple, swaps, onReset }) {
  const { level, nextLevelXp, currentXp } = xpForLevel(user?.xp || 0);
  const completed = swaps.filter(s => s.status === "completed").length;
  const total = swaps.length;

  const ACHIEVEMENTS_DEF = [
    { icon: "🎉", title: "First Trade",     desc: "Create your first swap",      check: () => total >= 1 },
    { icon: "🔄", title: "Keep Trading",    desc: "Create 5 swaps",              check: () => total >= 5 },
    { icon: "✅", title: "Commitment",      desc: "Complete your first swap",    check: () => completed >= 1 },
    { icon: "🏃", title: "On a Roll",       desc: "Complete 3 swaps",            check: () => completed >= 3 },
    { icon: "💎", title: "Swap Master",     desc: "Complete 10 swaps",           check: () => completed >= 10 },
    { icon: "🔥", title: "Power Couple",    desc: "Reach level 5",               check: () => level >= 5 },
  ];

  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ padding: "20px 0 14px" }}>
        <div style={{ fontFamily: fontDisp, fontSize: 22, fontWeight: 800, color: theme.text }}>◎ Profile</div>
      </div>

      <Card glow={theme.purple} style={{ marginBottom: 14, background: theme.bgDeep }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 14 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36 }}>{user?.avatar}</div>
            <div style={{ fontFamily: fontDisp, fontSize: 13, fontWeight: 800, color: theme.text, marginTop: 4 }}>{user?.name}</div>
            <Chip color={theme.purple} style={{ marginTop: 4 }}>Lvl {level}</Chip>
          </div>
          <div style={{ flex: 1, textAlign: "center", color: theme.textDim, fontSize: 18 }}>×</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36 }}>{partner?.avatar || "?"}</div>
            <div style={{ fontFamily: fontDisp, fontSize: 13, fontWeight: 800, color: theme.text, marginTop: 4 }}>{partner?.name || "Waiting…"}</div>
            <Chip color={theme.teal} style={{ marginTop: 4 }}>Lvl {xpForLevel(partner?.xp || 0).level}</Chip>
          </div>
        </div>
        <div style={{
          padding: "8px 14px", borderRadius: 10,
          background: theme.purple + "15", border: `1px dashed ${theme.purple}44`,
          textAlign: "center", fontFamily: font, fontSize: 11, color: theme.purple, letterSpacing: 0.5,
        }}>
          Couple ID: <strong>{couple?.id}</strong>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Total Swaps",  value: total,     color: theme.purple },
          { label: "Completed",    value: completed,  color: theme.jade },
          { label: "Your XP",      value: currentXp,  color: theme.gold },
          { label: "Level",        value: level,      color: theme.teal },
        ].map((s, i) => (
          <Card key={i} style={{ textAlign: "center", padding: "14px 10px" }}>
            <div style={{ fontFamily: fontDisp, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, fontFamily: font, color: theme.textDim, marginTop: 3 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ fontFamily: fontDisp, fontSize: 14, fontWeight: 800, color: theme.text, marginBottom: 10 }}>Achievements</div>
      {ACHIEVEMENTS_DEF.map((a, i) => {
        const done = a.check();
        return (
          <Card key={i} style={{ marginBottom: 8, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: done ? theme.gradTeal : theme.bgDeep,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, border: `1px solid ${done ? "transparent" : theme.border}`,
              }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: theme.text }}>
                  {a.title} {done && <span style={{ color: theme.jade }}>✓</span>}
                </div>
                <div style={{ fontFamily: font, fontSize: 11, color: theme.textSub, marginTop: 2 }}>{a.desc}</div>
              </div>
              {done && <Chip color={theme.jade}>Unlocked</Chip>}
            </div>
          </Card>
        );
      })}

      <Btn outline color={theme.rose} full style={{ marginTop: 16 }} onClick={onReset}>
        Leave couple & reset
      </Btn>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color: transparent; }
  body { background: #0F1021; }
  input::placeholder { color: #50507A; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: #252740; border-radius: 3px; }
  @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
`;

export default function App() {
  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState(null);
  const [couple, setCouple] = useState(null);
  const [swaps, setSwaps] = useState([]);
  const [toast, setToast] = useState(null);
  const [ready, setReady] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const userId = localStorage.getItem("swap_user_id");
    const coupleId = localStorage.getItem("swap_couple_id");
    if (!userId || !coupleId) { setReady(true); return; }
    loadSession(userId, coupleId);
  }, []);

  async function loadSession(userId, coupleId) {
    const [{ data: u }, { data: c }] = await Promise.all([
      supabase.from("users").select("*").eq("id", userId).single(),
      supabase.from("couples").select("*").eq("id", coupleId).single(),
    ]);
    if (!u || !c) { localStorage.clear(); setReady(true); return; }
    setUser(u);
    setCouple(c);

    // Load partner
    const partnerRole = u.role === "a" ? "b" : "a";
    const { data: p } = await supabase.from("users").select("*").eq("couple_id", coupleId).eq("role", partnerRole).single();
    setPartner(p);
    setReady(true);
    loadSwaps(coupleId);
  }

  const loadSwaps = useCallback(async (coupleId) => {
    const id = coupleId || couple?.id;
    if (!id) return;
    const { data } = await supabase.from("swaps").select("*").eq("couple_id", id).order("created_at", { ascending: false });
    setSwaps(data || []);
  }, [couple?.id]);

  // Real-time swap updates
  useEffect(() => {
    if (!couple?.id) return;
    const channel = supabase
      .channel("swaps-" + couple.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "swaps", filter: `couple_id=eq.${couple.id}` },
        (payload) => {
          loadSwaps(couple.id);
          if (payload.eventType === "INSERT" && payload.new.created_by !== user?.role) {
            setToast("⚡ New swap from your partner!");
          } else if (payload.eventType === "UPDATE" && payload.new.status === "active" && payload.new.created_by === user?.role) {
            setToast("✅ Your partner accepted a swap!");
          } else if (payload.eventType === "UPDATE" && payload.new.status === "completed") {
            setToast("🎉 A swap was completed! +20 XP");
            // Refresh user XP
            const uid = localStorage.getItem("swap_user_id");
            if (uid) supabase.from("users").select("*").eq("id", uid).single().then(({ data }) => data && setUser(data));
          }
        }
      ).subscribe();
    return () => supabase.removeChannel(channel);
  }, [couple?.id, user?.role, loadSwaps]);

  // Also poll partner XP
  useEffect(() => {
    if (!couple?.id || !user) return;
    const partnerRole = user.role === "a" ? "b" : "a";
    const channel = supabase
      .channel("partner-" + couple.id)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "users", filter: `couple_id=eq.${couple.id}` },
        ({ new: updated }) => {
          if (updated.role === partnerRole) setPartner(updated);
          if (updated.id === user.id) setUser(updated);
        }
      ).subscribe();
    return () => supabase.removeChannel(channel);
  }, [couple?.id, user]);

  function handleOnboardingDone() {
    const userId = localStorage.getItem("swap_user_id");
    const coupleId = localStorage.getItem("swap_couple_id");
    loadSession(userId, coupleId);
  }

  function handleReset() {
    localStorage.clear();
    setUser(null); setPartner(null); setCouple(null); setSwaps([]);
    setScreen("home");
  }

  if (!ready) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: theme.bg }}>
      <style>{globalCss}</style>
      <div style={{ fontFamily: fontDisp, fontSize: 36, fontWeight: 800, color: theme.purple }}>SWAP</div>
    </div>
  );

  if (!user || !couple) return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: theme.bg }}>
      <style>{globalCss}</style>
      <Onboarding onDone={handleOnboardingDone} />
    </div>
  );

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: theme.bg, position: "relative" }}>
      <style>{globalCss}</style>

      <div style={{
        position: "fixed", top: -120, left: "50%", transform: "translateX(-50%)",
        width: 500, height: 400, borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse, rgba(155,127,255,0.07) 0%, transparent 70%)",
      }} />

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      <div style={{ position: "relative", zIndex: 1 }}>
        {screen === "home"    && <Home user={user} partner={partner} couple={couple} swaps={swaps} setScreen={setScreen} />}
        {screen === "swaps"   && <SwapsList swaps={swaps} user={user} partner={partner} onRefresh={() => loadSwaps(couple.id)} />}
        {screen === "create"  && <CreateSwap user={user} coupleId={couple.id} onDone={() => { loadSwaps(couple.id); setScreen("home"); }} />}
        {screen === "battle"  && <Battle user={user} />}
        {screen === "profile" && <Profile user={user} partner={partner} couple={couple} swaps={swaps} onReset={handleReset} />}
      </div>

      <NavBar active={screen} set={setScreen} />
    </div>
  );
}
