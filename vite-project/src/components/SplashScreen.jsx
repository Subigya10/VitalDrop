import { useEffect, useState } from "react";

const VitalDropLogo = ({ phase }) => (
  <svg width="120" height="100" viewBox="0 0 120 100" fill="none"
    style={{
      filter: phase === "pulse" || phase === "tagline"
        ? "drop-shadow(0 0 18px rgba(239,68,68,0.7)) drop-shadow(0 0 40px rgba(239,68,68,0.35))"
        : "drop-shadow(0 0 6px rgba(239,68,68,0.25))",
      transition: "filter 0.8s ease",
    }}>
    <path d="M60 8 C60 8 44 28 44 38 C44 47.9 51.2 56 60 56 C68.8 56 76 47.9 76 38 C76 28 60 8 60 8Z" fill="url(#dropGrad)" />
    <rect x="56.5" y="28" width="7" height="20" rx="2" fill="white" />
    <rect x="50" y="34.5" width="20" height="7" rx="2" fill="white" />
    <path d="M18 72 C18 72 22 60 32 58 C38 57 44 60 50 61 C56 62 62 63 68 62 C74 61 80 58 85 59 C92 60 98 66 100 72 C95 80 85 86 72 88 C60 90 42 88 30 84 C22 81 18 76 18 72Z" fill="url(#handGrad)" />
    <path d="M95 65 C100 60 106 58 108 62 C110 66 106 72 100 73" stroke="#c0392b" strokeWidth="3" strokeLinecap="round" fill="none" />
    <defs>
      <linearGradient id="dropGrad" x1="60" y1="8" x2="60" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f87171"/>
        <stop offset="100%" stopColor="#b91c1c"/>
      </linearGradient>
      <linearGradient id="handGrad" x1="18" y1="58" x2="100" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ef4444"/>
        <stop offset="100%" stopColor="#991b1b"/>
      </linearGradient>
    </defs>
  </svg>
);

const SplashScreen = ({ onDone }) => {
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("rise"), 300);
    const t2 = setTimeout(() => setPhase("pulse"), 900);
    const t3 = setTimeout(() => setPhase("tagline"), 1500);
    const t4 = setTimeout(() => setPhase("exit"), 2900);
    const t5 = setTimeout(() => onDone(), 3500);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#0a0202",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: phase === "exit" ? 0 : 1,
      transition: "opacity 0.6s ease",
      fontFamily: "'Segoe UI', sans-serif",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", width: "460px", height: "460px",
        background: "radial-gradient(circle, rgba(180,20,20,0.18) 0%, transparent 70%)",
        borderRadius: "50%",
        transform: phase === "pulse" || phase === "tagline" ? "scale(1.5)" : "scale(0.8)",
        transition: "transform 1.2s ease",
      }} />
      {[220, 160].map((size, i) => (
        <div key={i} style={{
          position: "absolute", width: size, height: size,
          border: "1px solid rgba(239,68,68,0.15)", borderRadius: "50%",
          transform: phase === "pulse" || phase === "tagline" ? `scale(${1.7 - i * 0.1})` : `scale(${0.6 + i * 0.1})`,
          opacity: phase === "pulse" || phase === "tagline" ? 0 : 0.6,
          transition: `transform ${1.3 - i * 0.1}s ease ${i * 0.15}s, opacity ${1.3 - i * 0.1}s ease ${i * 0.15}s`,
        }} />
      ))}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", gap: "20px",
        transform: phase === "enter" ? "translateY(28px) scale(0.92)" : "translateY(0) scale(1)",
        opacity: phase === "enter" ? 0 : 1,
        transition: "transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease",
      }}>
        <VitalDropLogo phase={phase} />
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{
            fontSize: "40px", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1,
            textShadow: phase === "pulse" || phase === "tagline" ? "0 0 40px rgba(239,68,68,0.5)" : "none",
            transition: "text-shadow 0.8s ease",
          }}>
            <span style={{ color: "white" }}>Vital</span>
            <span style={{ color: "#ef4444" }}>Drop</span>
          </div>
          <div style={{
            width: phase === "tagline" ? "170px" : "0px", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.6), transparent)",
            margin: "2px auto", transition: "width 0.6s ease 0.1s",
          }} />
          <div style={{
            fontSize: "10px", fontWeight: 600, letterSpacing: "4px",
            textTransform: "uppercase", color: "rgba(239,68,68,0.75)",
            opacity: phase === "tagline" ? 1 : 0,
            transform: phase === "tagline" ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
          }}>
            Save Lives · Nepal
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "50px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "130px", height: "2px", background: "rgba(255,255,255,0.07)", borderRadius: "999px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, #b91c1c, #ef4444, #fca5a5)",
            borderRadius: "999px",
            transition: "width 2.4s cubic-bezier(0.4,0,0.2,1)",
            width: phase === "enter" ? "0%" : phase === "rise" ? "25%" : phase === "pulse" ? "60%" : phase === "tagline" ? "88%" : "100%",
          }} />
        </div>
        <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>
          Loading
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;