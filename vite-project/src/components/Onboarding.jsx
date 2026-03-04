import { useState } from "react";

const SLIDES = [
  {
    emoji: "🗺️",
    title: "Find Donors Near You",
    desc: "Locate blood donors in your area instantly using real GPS-based search across Nepal.",
    color: "#ef4444",
    bg: "linear-gradient(135deg, #1a0505 0%, #2d0a0a 100%)",
    accent: "rgba(239,68,68,0.12)",
  },
  {
    emoji: "🚨",
    title: "Respond to Emergencies",
    desc: "Get notified about critical blood requests near you and respond in minutes to save a life.",
    color: "#f59e0b",
    bg: "linear-gradient(135deg, #0f0a00 0%, #1f1500 100%)",
    accent: "rgba(245,158,11,0.12)",
  },
  {
    emoji: "❤️",
    title: "Track Your Impact",
    desc: "See how many lives you've saved, earn badges, and climb the donor leaderboard.",
    color: "#10b981",
    bg: "linear-gradient(135deg, #000f08 0%, #001a0e 100%)",
    accent: "rgba(16,185,129,0.12)",
  },
];

const Onboarding = ({ onDone }) => {
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(false);

  const next = () => {
    if (current < SLIDES.length - 1) {
      setExiting(true);
      setTimeout(() => { setCurrent(c => c + 1); setExiting(false); }, 200);
    } else {
      onDone();
    }
  };

  const slide = SLIDES[current];

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: slide.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px",
      transition: "background 0.4s ease",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <button onClick={onDone} style={{
        position: "absolute", top: "24px", right: "24px",
        color: "rgba(255,255,255,0.3)", fontSize: "13px",
        fontWeight: 600, background: "none", border: "none",
        cursor: "pointer", letterSpacing: "0.5px",
      }}>Skip</button>

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", maxWidth: "360px", width: "100%",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "translateX(-20px)" : "translateX(0)",
      }}>
        <div style={{
          width: "120px", height: "120px",
          background: slide.accent, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "52px", marginBottom: "36px",
          border: `1px solid ${slide.color}22`,
          boxShadow: `0 0 60px ${slide.color}22`,
        }}>
          {slide.emoji}
        </div>
        <h2 style={{
          fontSize: "28px", fontWeight: 900, color: "white",
          margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.5px",
        }}>{slide.title}</h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>
          {slide.desc}
        </p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "48px", marginBottom: "32px" }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{
            height: "6px", width: i === current ? "28px" : "6px",
            borderRadius: "999px",
            background: i === current ? slide.color : "rgba(255,255,255,0.15)",
            transition: "all 0.3s ease", cursor: "pointer",
          }} />
        ))}
      </div>

      <button onClick={next} style={{
        width: "100%", maxWidth: "360px", padding: "16px",
        background: slide.color, color: "white", border: "none",
        borderRadius: "16px", fontSize: "16px", fontWeight: 800,
        cursor: "pointer", boxShadow: `0 8px 24px ${slide.color}40`,
        transition: "transform 0.15s ease",
      }}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {current === SLIDES.length - 1 ? "Let's Go 🩸" : "Next →"}
      </button>
    </div>
  );
};

export default Onboarding;