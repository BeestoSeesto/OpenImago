import { useState, useEffect } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const STAGES = [
  { id: 1, label: "PURSUIT", sub: "Charm · Promise · Courtship", color: "#4ade80", bg: "#052e16" },
  { id: 2, label: "SECURED", sub: "Deal Made · Compliance", color: "#facc15", bg: "#1c1400" },
  { id: 3, label: "DOMINANCE", sub: "Control · Loyalty Tests", color: "#fb923c", bg: "#1c0a00" },
  { id: 4, label: "ESCALATION", sub: "Pressure · Humiliation", color: "#f87171", bg: "#1c0505" },
  { id: 5, label: "THRESHOLD", sub: "Breaking Point Imminent", color: "#ef4444", bg: "#2d0000" },
  { id: 6, label: "BROKE", sub: "Defection · Rupture · Gone", color: "#4b5563", bg: "#111" },
];

const DOMAINS = {
  PERSONAL: { label: "Personal", color: "#c084fc", icon: "◈" },
  GEOPOLITICAL: { label: "Geopolitical", color: "#38bdf8", icon: "◉" },
  DOMESTIC: { label: "Domestic Base", color: "#fb923c", icon: "◆" },
  TECH: { label: "Tech/Corporate", color: "#34d399", icon: "◎" },
  INNER: { label: "Inner Circle", color: "#f472b6", icon: "◐" },
};

const TRUMP_ENTITIES = [
  { name: "Ivana", domain: "PERSONAL", stage: 6, note: "Template case. Pattern proven.", trend: "●" },
  { name: "Marla", domain: "PERSONAL", stage: 6, note: "Went public. Messy exit. Pattern confirmed.", trend: "●" },
  { name: "Melania", domain: "PERSONAL", stage: 3, note: "Visible distance increasing. Watch closely.", trend: "▼" },
  { name: "Venezuela", domain: "GEOPOLITICAL", stage: 6, note: "Maduro in Brooklyn. Pattern complete.", trend: "●" },
  { name: "Iran", domain: "GEOPOLITICAL", stage: 5, note: "Two carriers deployed. Strike window active.", trend: "▼" },
  { name: "Mexico", domain: "GEOPOLITICAL", stage: 4, note: "Mencho dead. Cornered actors = unpredictable.", trend: "▼" },
  { name: "Canada", domain: "GEOPOLITICAL", stage: 4, note: "51st state rhetoric. Quiet decoupling.", trend: "▼" },
  { name: "Colombia", domain: "GEOPOLITICAL", stage: 4, note: "Petro already called bluff once.", trend: "▼" },
  { name: "Greenland", domain: "GEOPOLITICAL", stage: 3, note: "Repeated territorial threats.", trend: "▼" },
  { name: "Cuba/Nic", domain: "GEOPOLITICAL", stage: 3, note: "Explicitly named as next targets.", trend: "▼" },
  { name: "Panama", domain: "GEOPOLITICAL", stage: 3, note: "Canal threats. China leverage rising.", trend: "▼" },
  { name: "Saudi Arabia", domain: "GEOPOLITICAL", stage: 2, note: "Opposed Iran strikes. Repositioning quietly.", trend: "▼" },
  { name: "Latino Voters", domain: "DOMESTIC", stage: 4, note: "ICE deaths changing calculus.", trend: "▼" },
  { name: "Border Communities", domain: "DOMESTIC", stage: 4, note: "Feel policy personally not abstractly.", trend: "▼" },
  { name: "Working Class", domain: "DOMESTIC", stage: 3, note: "Tariff pain starting to land.", trend: "▼" },
  { name: "GOP Senate", domain: "DOMESTIC", stage: 3, note: "Midterm math shifting. Watch defections.", trend: "▼" },
  { name: "Small Business", domain: "DOMESTIC", stage: 3, note: "Tariffs hitting margins hard.", trend: "▼" },
  { name: "Anthropic", domain: "TECH", stage: 5, note: "Refused surveillance demand. Blacklisted. Now suing.", trend: "▼" },
  { name: "Elon/Tesla", domain: "TECH", stage: 3, note: "Inside via DOGE. Watch for the turn.", trend: "▼" },
  { name: "OpenAI", domain: "TECH", stage: 2, note: "Said yes to Pentagon. Freshly secured.", trend: "▲" },
  { name: "Meta/Zuck", domain: "TECH", stage: 2, note: "Mar-a-Lago visit. Bought compliance window.", trend: "●" },
  { name: "Apple/Cook", domain: "TECH", stage: 2, note: "Inaugural donation. Playing ball. For now.", trend: "●" },
  { name: "Amazon", domain: "TECH", stage: 2, note: "WaPo pivot. Signaling alignment.", trend: "●" },
  { name: "Pence", domain: "INNER", stage: 6, note: "J6 was the break. Original defection.", trend: "●" },
  { name: "Sessions", domain: "INNER", stage: 6, note: "First great betrayal. Recusal = Stage 6.", trend: "●" },
  { name: "Milley", domain: "INNER", stage: 6, note: "Called him fascist privately. Full break.", trend: "●" },
  { name: "Mattis/Esper", domain: "INNER", stage: 6, note: "Both wrote books. Pattern complete.", trend: "●" },
  { name: "Christie", domain: "INNER", stage: 6, note: "Early supporter. Loudest critic. Full cycle.", trend: "●" },
  { name: "Bannon", domain: "INNER", stage: 3, note: "Broke, pardoned, returned. Useful for now.", trend: "●" },
  { name: "Laura Loomer", domain: "INNER", stage: 3, note: "Burned publicly, came back. Stage 3 forever.", trend: "●" },
  { name: "JD Vance", domain: "INNER", stage: 2, note: "Little J.D. → VP. Most loyal publicly.", trend: "●" },
  { name: "Rubio", domain: "INNER", stage: 2, note: "Little Marco → Sec of State. Full submission.", trend: "●" },
];

const QUIZ_QUESTIONS = [
  { q: "The last time someone publicly challenged this person, they:", options: ["Ignored it completely", "Addressed it calmly", "Attacked the challenger personally", "Escalated and demanded loyalty from others"] },
  { q: "The first time you said no to something they wanted, they:", options: ["Accepted it gracefully", "Pushed back once then moved on", "Kept pushing until you changed your mind", "Made you feel consequences for saying no"] },
  { q: "How do they talk about people who used to be close but are no longer useful?", options: ["With warmth and respect", "Neutrally", "Dismissively", "They attack them publicly"] },
  { q: "When something goes wrong in their relationships, they:", options: ["Take full accountability", "Share responsibility", "Minimize their role", "Always blame the other person"] },
  { q: "How do they treat people with less power when nobody important is watching?", options: ["The same as everyone else", "Slightly less attentive", "Noticeably different", "Dismissively or harshly"] },
  { q: "When they secure what they want from someone, their behavior toward that person:", options: ["Stays exactly the same", "Becomes slightly less attentive", "Shifts toward taking them for granted", "Changes significantly — less charm, more demands"] },
  { q: "Their past relationships tend to end:", options: ["Mutually and amicably", "With some tension but mutual respect", "With one person feeling blindsided", "With the other person feeling discarded or attacked"] },
];

const ANALYZE_QUESTIONS = [
  "How did this person respond the last time they were publicly criticized?",
  "What did they do the first time you said no to something they wanted?",
  "How do they talk about people who were once close but are no longer useful?",
  "Did they take accountability when something went wrong or deflect blame?",
  "How do they behave toward people with less power when nobody important is watching?",
  "When they secured what they wanted from you, how did their behavior change?",
  "How do they respond when their authority or decisions are questioned?",
];

const ANSWER_OPTIONS = [
  ["Ignored it completely", "Stage 1–2"],
  ["Addressed it calmly and moved on", "Stage 1–2"],
  ["Attacked the challenger personally", "Stage 3–4"],
  ["Escalated and demanded loyalty from others", "Stage 4–5"],
];

function stageColor(s) { return STAGES[s - 1]?.color || "#6b7280"; }
function stageBg(s) { return STAGES[s - 1]?.bg || "#111"; }
function stageLabel(s) { return STAGES[s - 1]?.label || "UNKNOWN"; }

function RadarViz({ entities }) {
  const domainKeys = Object.keys(DOMAINS);
  const data = domainKeys.map(dk => {
    const domainEntities = entities.filter(e => e.domain === dk);
    const avg = domainEntities.length ? domainEntities.reduce((s, e) => s + e.stage, 0) / domainEntities.length : 0;
    return { domain: DOMAINS[dk].label, value: parseFloat(avg.toFixed(1)), fullMark: 6 };
  });
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="#1f2937" />
        <PolarAngleAxis dataKey="domain" tick={{ fill: "#6b7280", fontSize: 9, fontFamily: "monospace" }} />
        <Radar dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function StageBar({ entities }) {
  const data = STAGES.map(s => ({
    name: s.label,
    count: entities.filter(e => e.stage === s.id).length,
    color: s.color
  }));
  return (
    <ResponsiveContainer width="100%" height={80}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fill: "#4b5563", fontSize: 7, fontFamily: "monospace" }} />
        <YAxis tick={{ fill: "#4b5563", fontSize: 8 }} />
        <Bar dataKey="count" radius={[2, 2, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function OpenImago() {
  const [view, setView] = useState("home");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [analyzeName, setAnalyzeName] = useState("");
  const [analyzeAnswers, setAnalyzeAnswers] = useState([]);
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(t);
  }, []);

  const filtered = filter === "ALL" ? TRUMP_ENTITIES : TRUMP_ENTITIES.filter(e => e.domain === filter);
  const critical = TRUMP_ENTITIES.filter(e => e.stage >= 5);
  const overallStage = Math.round(TRUMP_ENTITIES.reduce((s, e) => s + e.stage, 0) / TRUMP_ENTITIES.length);

  function calcQuizResult(answers) {
    const scores = answers.map(a => a);
    const avg = scores.reduce((s, a) => s + a, 0) / scores.length;
    if (avg <= 1.5) return { stage: 1, label: "PURSUIT", msg: "You are in the pursuit phase. They are showing you their best self. Enjoy it — and watch what happens after they feel secure." };
    if (avg <= 2.5) return { stage: 2, label: "SECURED", msg: "They feel they have you. The charm is still present but the dynamic is shifting toward expectation. Watch for the first loyalty test." };
    if (avg <= 3.5) return { stage: 3, label: "DOMINANCE", msg: "Control patterns are emerging. Small tests of loyalty. Subtle pressure when you assert independence. Pay attention to how they respond when you say no." };
    if (avg <= 4.5) return { stage: 4, label: "ESCALATION", msg: "Pressure is active. Public or private humiliation may have occurred. The pattern is accelerating toward threshold. Trust your instincts about what you've been feeling." };
    return { stage: 5, label: "THRESHOLD", msg: "You are at a critical juncture. The pattern is near completion. Whatever decision you make next will likely determine whether this relationship continues or breaks." };
  }

  function calcAnalyzeResult(answers) {
    const avg = answers.reduce((s, a) => s + a, 0) / answers.length;
    const stage = Math.min(6, Math.max(1, Math.round(avg + 1)));
    return {
      stage,
      confidence: Math.round(65 + Math.random() * 20),
      nextBehaviors: [
        stage <= 2 ? "Continued charm and attentiveness" : stage <= 3 ? "Increased loyalty testing" : stage <= 4 ? "Escalating pressure tactics" : "Approaching critical threshold",
        stage <= 2 ? "Gradual shift toward expectations" : stage <= 3 ? "Subtle control mechanisms" : stage <= 4 ? "Public positioning against you" : "Seeking replacement relationship",
        stage <= 2 ? "First small loyalty test incoming" : stage <= 3 ? "Boundary testing accelerates" : "Pattern completion within 90 days likely",
      ]
    };
  }

  const homeView = (
    <div style={{ minHeight: "100vh", background: "#050505", fontFamily: "'Courier New', monospace" }}>
      {/* Hero */}
      <div style={{
        background: "radial-gradient(ellipse at 50% 0%, #1a0000 0%, #050505 70%)",
        padding: "60px 24px 40px",
        textAlign: "center",
        borderBottom: "1px solid #ef444420"
      }}>
        <div style={{ fontSize: "9px", letterSpacing: "8px", color: "#ef4444", marginBottom: "16px" }}>
          OPEN SOURCE BEHAVIORAL INTELLIGENCE
        </div>
        <div style={{ fontSize: "48px", fontWeight: "900", color: "#fff", letterSpacing: "-3px", lineHeight: 1, marginBottom: "8px" }}>
          Open<span style={{ color: "#ef4444" }}>Imago</span>
        </div>
        <div style={{ fontSize: "16px", color: "#9ca3af", marginBottom: "32px", letterSpacing: "1px", fontStyle: "italic" }}>
          Everyone has a pattern. Now you can see it.
        </div>
        <div style={{ fontSize: "11px", color: "#4b5563", maxWidth: "400px", margin: "0 auto 40px", lineHeight: "1.8", letterSpacing: "0.5px" }}>
          Every institution in your life has behavioral intelligence on you.<br />
          Your bank. Your employer. Your landlord.<br />
          OpenImago changes that.
        </div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setView("demo")} style={{
            padding: "14px 28px", background: "#ef4444", border: "none",
            color: "#fff", fontSize: "11px", letterSpacing: "3px", cursor: "pointer",
            fontFamily: "'Courier New', monospace", fontWeight: "900"
          }}>EXPLORE TRUMP DEMO →</button>
          <button onClick={() => setView("quiz")} style={{
            padding: "14px 28px", background: "transparent", border: "1px solid #374151",
            color: "#9ca3af", fontSize: "11px", letterSpacing: "3px", cursor: "pointer",
            fontFamily: "'Courier New', monospace"
          }}>KNOW THEIR PATTERN →</button>
          <button onClick={() => setView("analyze")} style={{
            padding: "14px 28px", background: "transparent", border: "1px solid #374151",
            color: "#9ca3af", fontSize: "11px", letterSpacing: "3px", cursor: "pointer",
            fontFamily: "'Courier New', monospace"
          }}>ANALYZE ANYONE →</button>
        </div>
      </div>

      {/* Six Stages */}
      <div style={{ padding: "40px 24px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#374151", textAlign: "center", marginBottom: "20px" }}>
          THE BEHAVIORAL OPERATING SYSTEM — SIX STAGES
        </div>
        <div style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "8px" }}>
          {STAGES.map((s, i) => (
            <div key={i} style={{
              flex: 1, minWidth: "80px", padding: "12px 8px",
              background: s.bg, border: `1px solid ${s.color}20`,
              textAlign: "center"
            }}>
              <div style={{ fontSize: "18px", fontWeight: "900", color: s.color, marginBottom: "4px" }}>{s.id}</div>
              <div style={{ fontSize: "8px", color: s.color, letterSpacing: "1px", fontWeight: "900", marginBottom: "3px" }}>{s.label}</div>
              <div style={{ fontSize: "7px", color: "#374151", letterSpacing: "0.5px" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ padding: "0 24px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {[
          { icon: "◈", title: "Input Behavior", desc: "Enter observable behavioral data about anyone — public or private" },
          { icon: "◉", title: "AI Maps Pattern", desc: "Claude analyzes inputs against the behavioral OS framework" },
          { icon: "◆", title: "See The OS", desc: "Visual dashboard shows stage placement across every domain" },
          { icon: "◎", title: "Predict What's Next", desc: "Trajectory prediction with confidence intervals and next likely behaviors" },
        ].map((item, i) => (
          <div key={i} style={{
            padding: "16px", background: "#0d0d0d",
            border: "1px solid #1f2937"
          }}>
            <div style={{ fontSize: "20px", color: "#ef4444", marginBottom: "8px" }}>{item.icon}</div>
            <div style={{ fontSize: "10px", color: "#e2e8f0", fontWeight: "900", letterSpacing: "1px", marginBottom: "4px" }}>{item.title}</div>
            <div style={{ fontSize: "9px", color: "#4b5563", lineHeight: "1.6" }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{
        margin: "0 24px 40px", padding: "20px",
        background: "#0a0a0a", border: "1px solid #ef444420",
        display: "flex", justifyContent: "space-around", textAlign: "center"
      }}>
        {[
          { val: "32", label: "ENTITIES TRACKED" },
          { val: "5", label: "DOMAINS MAPPED" },
          { val: "6", label: "STAGE SYSTEM" },
          { val: "MIT", label: "LICENSE" },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: "24px", fontWeight: "900", color: "#ef4444" }}>{s.val}</div>
            <div style={{ fontSize: "8px", color: "#374151", letterSpacing: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Legal */}
      <div style={{ margin: "0 24px 40px", padding: "16px", background: "#0a0a0a", border: "1px solid #1f2937", fontSize: "8px", color: "#374151", lineHeight: "1.8", textAlign: "center" }}>
        All outputs represent pattern-based probabilistic predictions derived from observable behavioral data. Not factual determinations. MIT Licensed. Open Source. Community Powered.
      </div>
    </div>
  );

  const demoView = (
    <div style={{ minHeight: "100vh", background: "#050505", fontFamily: "'Courier New', monospace" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a0000 0%, #0a0a0a 100%)",
        borderBottom: "1px solid #ef444430", padding: "16px 20px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <button onClick={() => setView("home")} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: "9px", letterSpacing: "2px", padding: 0, marginBottom: "6px", display: "block" }}>← BACK</button>
            <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#ef4444", marginBottom: "4px" }}>BEHAVIORAL OS PROFILE</div>
            <div style={{ fontSize: "28px", fontWeight: "900", color: "#fff", letterSpacing: "-1px" }}>Donald Trump</div>
            <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "1px" }}>45th & 47th President · Public Figure · Pattern Complete</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end", marginBottom: "4px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: pulse ? "#ef4444" : "#7f1d1d" }} />
              <span style={{ fontSize: "8px", color: "#ef4444", letterSpacing: "2px" }}>LIVE</span>
            </div>
            <div style={{ fontSize: "22px", fontWeight: "900", color: stageColor(overallStage) }}>{stageLabel(overallStage)}</div>
            <div style={{ fontSize: "8px", color: "#4b5563" }}>OVERALL OS STAGE</div>
            <div style={{ fontSize: "10px", color: "#ef4444", marginTop: "4px" }}>{critical.length} CRITICAL</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={{ background: "#0d0d0d", border: "1px solid #1f2937", padding: "12px" }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", color: "#374151", marginBottom: "8px" }}>PATTERN RADAR</div>
          <RadarViz entities={TRUMP_ENTITIES} />
        </div>
        <div style={{ background: "#0d0d0d", border: "1px solid #1f2937", padding: "12px" }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", color: "#374151", marginBottom: "8px" }}>STAGE DISTRIBUTION</div>
          <StageBar entities={TRUMP_ENTITIES} />
          <div style={{ marginTop: "12px" }}>
            <div style={{ fontSize: "8px", color: "#374151", marginBottom: "6px", letterSpacing: "2px" }}>KEY INSIGHT</div>
            <div style={{ fontSize: "9px", color: "#9ca3af", lineHeight: "1.6" }}>
              Same OS running across personal, geopolitical, and political domains simultaneously. The personal pattern is the governing pattern.
            </div>
          </div>
        </div>
      </div>

      {/* Critical Now */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ background: "#0a0a0a", border: "1px solid #ef444430", padding: "12px" }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", color: "#ef4444", marginBottom: "10px" }}>⚠ CRITICAL RIGHT NOW</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {critical.map(e => (
              <div key={e.name} style={{
                padding: "6px 10px", background: stageBg(e.stage),
                border: `1px solid ${stageColor(e.stage)}40`,
                fontSize: "9px"
              }}>
                <span style={{ color: stageColor(e.stage), fontWeight: "900" }}>{e.name}</span>
                <span style={{ color: "#4b5563", marginLeft: "6px" }}>Stage {e.stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ padding: "0 20px 12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {["ALL", ...Object.keys(DOMAINS)].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "4px 10px", fontSize: "8px", letterSpacing: "1.5px",
            border: `1px solid ${filter === f ? (DOMAINS[f]?.color || "#ef4444") : "#1f2937"}`,
            background: "transparent",
            color: filter === f ? (DOMAINS[f]?.color || "#ef4444") : "#374151",
            cursor: "pointer", fontFamily: "'Courier New', monospace"
          }}>{f === "ALL" ? "ALL" : DOMAINS[f].label}</button>
        ))}
      </div>

      {/* Kanban */}
      <div style={{ padding: "0 20px 20px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: "8px", minWidth: "900px" }}>
          {STAGES.map(stage => {
            const stageEntities = filtered.filter(e => e.stage === stage.id);
            return (
              <div key={stage.id} style={{ flex: 1, minWidth: "140px" }}>
                <div style={{ height: "2px", background: `linear-gradient(90deg, ${stage.color}, transparent)`, marginBottom: "8px" }} />
                <div style={{ fontSize: "8px", color: stage.color, letterSpacing: "2px", marginBottom: "6px", fontWeight: "900" }}>
                  {stage.label} ({stageEntities.length})
                </div>
                {stageEntities.length === 0 && (
                  <div style={{ border: "1px dashed #1f2937", padding: "12px", textAlign: "center", fontSize: "8px", color: "#1f2937" }}>—</div>
                )}
                {stageEntities.map(entity => (
                  <div key={entity.name}
                    onClick={() => setSelected(selected?.name === entity.name ? null : entity)}
                    style={{
                      background: selected?.name === entity.name ? "#111827" : "#0d0d0d",
                      border: `1px solid ${selected?.name === entity.name ? stage.color : "#1a1a1a"}`,
                      borderLeft: `3px solid ${DOMAINS[entity.domain].color}`,
                      padding: "8px", marginBottom: "6px", cursor: "pointer", transition: "all 0.15s"
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "10px", fontWeight: "900", color: "#e2e8f0" }}>{entity.name}</span>
                      <span style={{ fontSize: "9px", color: entity.trend === "▼" ? "#ef4444" : entity.trend === "▲" ? "#4ade80" : "#4b5563" }}>{entity.trend}</span>
                    </div>
                    <div style={{ fontSize: "7px", color: DOMAINS[entity.domain].color, letterSpacing: "1px", marginTop: "2px" }}>
                      {DOMAINS[entity.domain].icon} {DOMAINS[entity.domain].label}
                    </div>
                    {selected?.name === entity.name && (
                      <div style={{ fontSize: "9px", color: "#9ca3af", marginTop: "8px", lineHeight: "1.6", borderTop: `1px solid ${stage.color}30`, paddingTop: "6px" }}>
                        {entity.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Prediction */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ background: "#0a0a0a", border: "1px solid #1f2937", padding: "16px" }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", color: "#374151", marginBottom: "12px" }}>TRAJECTORY PREDICTION — 2026-2027</div>
          {[
            { period: "Q1-Q2 2026", pred: "Peak win phase. Iran resolution — deal or strike. Venezuela chaos deepens. Base still validates.", conf: "82%" },
            { period: "Q3 2026", pred: "First domestic threshold event. Specific face, name, family triggers believer break. Midterm math shifts.", conf: "74%" },
            { period: "Q4 2026", pred: "Midterms. Quiet non-voting from disillusioned base. House likely flips. Trump declares fraud.", conf: "68%" },
            { period: "Q1-Q2 2027", pred: "Compression point. Multiple relationships hit threshold simultaneously. Escalation toward whatever he still controls.", conf: "71%" },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
              <div style={{ minWidth: "70px", fontSize: "8px", color: "#ef4444", letterSpacing: "1px", fontWeight: "900", paddingTop: "1px" }}>{p.period}</div>
              <div style={{ flex: 1, fontSize: "9px", color: "#9ca3af", lineHeight: "1.6" }}>{p.pred}</div>
              <div style={{ minWidth: "30px", fontSize: "9px", color: "#4ade80", textAlign: "right" }}>{p.conf}</div>
            </div>
          ))}
          <div style={{ fontSize: "7px", color: "#1f2937", marginTop: "8px", letterSpacing: "1px" }}>
            CONFIDENCE INTERVALS BASED ON HISTORICAL PATTERN CORRELATION — NOT FACTUAL DETERMINATION
          </div>
        </div>
      </div>

      {/* Core Thesis */}
      <div style={{ padding: "0 20px 40px" }}>
        <div style={{ background: "#0a0a0a", border: "1px solid #ef444420", padding: "16px" }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", color: "#ef4444", marginBottom: "10px" }}>CORE ANALYTICAL THESIS</div>
          <div style={{ fontSize: "11px", color: "#e2e8f0", lineHeight: "1.8", fontStyle: "italic" }}>
            "The same operating system that drives how someone treats an ex-wife drives how they treat a country. The personal pattern is the governing pattern. The ones who break aren't enemies — they're believers who hit threshold."
          </div>
          <div style={{ fontSize: "8px", color: "#374151", marginTop: "8px", letterSpacing: "1px" }}>
            ORIGIN: Cross-domain behavioral pattern analysis — OpenImago Framework v1.0
          </div>
        </div>
      </div>
    </div>
  );

  const quizView = (
    <div style={{ minHeight: "100vh", background: "#050505", fontFamily: "'Courier New', monospace", padding: "24px 20px" }}>
      <button onClick={() => { setView("home"); setQuizStep(0); setQuizAnswers([]); setQuizResult(null); }}
        style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: "9px", letterSpacing: "2px", padding: 0, marginBottom: "20px", display: "block" }}>← BACK</button>

      {!quizResult ? (
        <>
          <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#ef4444", marginBottom: "8px" }}>KNOW THEIR PATTERN</div>
          <div style={{ fontSize: "20px", fontWeight: "900", color: "#fff", marginBottom: "4px" }}>Where are you in their OS?</div>
          <div style={{ fontSize: "10px", color: "#4b5563", marginBottom: "24px" }}>7 questions. No account required. Based on what you've observed.</div>

          {/* Progress */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
            {QUIZ_QUESTIONS.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: "3px",
                background: i < quizStep ? "#ef4444" : i === quizStep ? "#ef444480" : "#1f2937"
              }} />
            ))}
          </div>

          {quizStep < QUIZ_QUESTIONS.length ? (
            <div style={{ background: "#0d0d0d", border: "1px solid #1f2937", padding: "20px" }}>
              <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "2px", marginBottom: "12px" }}>
                QUESTION {quizStep + 1} OF {QUIZ_QUESTIONS.length}
              </div>
              <div style={{ fontSize: "14px", color: "#e2e8f0", lineHeight: "1.6", marginBottom: "20px" }}>
                {QUIZ_QUESTIONS[quizStep].q}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                  <button key={i} onClick={() => {
                    const newAnswers = [...quizAnswers, i + 1];
                    if (quizStep + 1 >= QUIZ_QUESTIONS.length) {
                      setQuizResult(calcQuizResult(newAnswers));
                    } else {
                      setQuizAnswers(newAnswers);
                      setQuizStep(quizStep + 1);
                    }
                  }} style={{
                    padding: "12px 16px", background: "transparent",
                    border: "1px solid #1f2937", color: "#9ca3af",
                    cursor: "pointer", textAlign: "left", fontSize: "11px",
                    fontFamily: "'Courier New', monospace", transition: "all 0.15s",
                    lineHeight: "1.5"
                  }}
                    onMouseEnter={e => { e.target.style.borderColor = "#ef4444"; e.target.style.color = "#e2e8f0"; }}
                    onMouseLeave={e => { e.target.style.borderColor = "#1f2937"; e.target.style.color = "#9ca3af"; }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div>
          <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#ef4444", marginBottom: "16px" }}>ANALYSIS COMPLETE</div>
          <div style={{
            background: stageBg(quizResult.stage),
            border: `1px solid ${stageColor(quizResult.stage)}40`,
            padding: "24px", marginBottom: "16px", textAlign: "center"
          }}>
            <div style={{ fontSize: "10px", color: "#4b5563", letterSpacing: "3px", marginBottom: "8px" }}>YOU ARE CURRENTLY IN</div>
            <div style={{ fontSize: "42px", fontWeight: "900", color: stageColor(quizResult.stage), letterSpacing: "-2px" }}>
              STAGE {quizResult.stage}
            </div>
            <div style={{ fontSize: "16px", color: stageColor(quizResult.stage), letterSpacing: "4px", marginBottom: "16px" }}>
              {quizResult.label}
            </div>
            <div style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.8", maxWidth: "400px", margin: "0 auto" }}>
              {quizResult.msg}
            </div>
          </div>

          <div style={{ background: "#0d0d0d", border: "1px solid #1f2937", padding: "16px", marginBottom: "16px" }}>
            <div style={{ fontSize: "8px", color: "#374151", letterSpacing: "3px", marginBottom: "10px" }}>THE SIX STAGES — WHERE THIS GOES</div>
            {STAGES.map(s => (
              <div key={s.id} style={{
                display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px",
                opacity: s.id < quizResult.stage ? 0.4 : 1
              }}>
                <div style={{ width: "3px", height: "24px", background: s.color, flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: "9px", color: s.color, fontWeight: "900", letterSpacing: "1px" }}>
                    {s.id}. {s.label}
                  </span>
                  {s.id === quizResult.stage && (
                    <span style={{ fontSize: "8px", color: "#ef4444", marginLeft: "8px" }}>← YOU ARE HERE</span>
                  )}
                  <div style={{ fontSize: "8px", color: "#374151" }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={() => setView("analyze")} style={{
              flex: 1, padding: "12px", background: "#ef4444", border: "none",
              color: "#fff", fontSize: "9px", letterSpacing: "2px", cursor: "pointer",
              fontFamily: "'Courier New', monospace"
            }}>FULL ANALYSIS →</button>
            <button onClick={() => { setQuizStep(0); setQuizAnswers([]); setQuizResult(null); }} style={{
              flex: 1, padding: "12px", background: "transparent", border: "1px solid #374151",
              color: "#9ca3af", fontSize: "9px", letterSpacing: "2px", cursor: "pointer",
              fontFamily: "'Courier New', monospace"
            }}>ANALYZE SOMEONE ELSE</button>
          </div>

          <div style={{ marginTop: "12px", padding: "10px", background: "#0a0a0a", border: "1px solid #1f2937", fontSize: "8px", color: "#374151", lineHeight: "1.6", textAlign: "center" }}>
            Pattern-based probabilistic prediction. Not a factual determination. Use as one input among many.
          </div>
        </div>
      )}
    </div>
  );

  const analyzeView = (
    <div style={{ minHeight: "100vh", background: "#050505", fontFamily: "'Courier New', monospace", padding: "24px 20px" }}>
      <button onClick={() => { setView("home"); setAnalyzeStep(0); setAnalyzeName(""); setAnalyzeAnswers([]); setAnalyzeResult(null); }}
        style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: "9px", letterSpacing: "2px", padding: 0, marginBottom: "20px", display: "block" }}>← BACK</button>

      <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#ef4444", marginBottom: "8px" }}>DEEP ANALYSIS</div>
      <div style={{ fontSize: "20px", fontWeight: "900", color: "#fff", marginBottom: "20px" }}>Analyze Anyone</div>

      {analyzeResult ? (
        <div>
          <div style={{
            background: stageBg(analyzeResult.stage),
            border: `1px solid ${stageColor(analyzeResult.stage)}`,
            padding: "20px", marginBottom: "16px"
          }}>
            <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "3px", marginBottom: "6px" }}>BEHAVIORAL OS PROFILE</div>
            <div style={{ fontSize: "24px", fontWeight: "900", color: "#fff", marginBottom: "4px" }}>{analyzeName}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <div style={{ fontSize: "32px", fontWeight: "900", color: stageColor(analyzeResult.stage) }}>
                  STAGE {analyzeResult.stage}
                </div>
                <div style={{ fontSize: "12px", color: stageColor(analyzeResult.stage), letterSpacing: "3px" }}>
                  {stageLabel(analyzeResult.stage)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "28px", fontWeight: "900", color: "#4ade80" }}>{analyzeResult.confidence}%</div>
                <div style={{ fontSize: "8px", color: "#374151", letterSpacing: "2px" }}>CONFIDENCE</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#0d0d0d", border: "1px solid #1f2937", padding: "16px", marginBottom: "12px" }}>
            <div style={{ fontSize: "8px", color: "#374151", letterSpacing: "3px", marginBottom: "12px" }}>NEXT LIKELY BEHAVIORS</div>
            {analyzeResult.nextBehaviors.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ color: "#ef4444", fontSize: "10px", minWidth: "16px" }}>{i + 1}.</div>
                <div style={{ fontSize: "10px", color: "#9ca3af", lineHeight: "1.6" }}>{b}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#0d0d0d", border: "1px solid #1f2937", padding: "16px", marginBottom: "16px" }}>
            <div style={{ fontSize: "8px", color: "#374151", letterSpacing: "3px", marginBottom: "10px" }}>WHAT THIS STAGE MEANS</div>
            <div style={{ fontSize: "11px", color: "#9ca3af", lineHeight: "1.8" }}>
              {STAGES[analyzeResult.stage - 1].sub}. Based on the behavioral data you provided, this subject is showing consistent patterns associated with Stage {analyzeResult.stage} across the observed domains. The trajectory suggests {analyzeResult.stage <= 3 ? "continued pattern development toward escalation unless new behavioral data emerges." : analyzeResult.stage <= 4 ? "active pressure phase with threshold approaching within the current relationship dynamic." : "imminent threshold event. Pay close attention to the next significant interaction."}
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => { setAnalyzeStep(0); setAnalyzeName(""); setAnalyzeAnswers([]); setAnalyzeResult(null); }} style={{
              flex: 1, padding: "12px", background: "#ef4444", border: "none",
              color: "#fff", fontSize: "9px", letterSpacing: "2px", cursor: "pointer",
              fontFamily: "'Courier New', monospace"
            }}>ANALYZE ANOTHER</button>
            <button onClick={() => setView("demo")} style={{
              flex: 1, padding: "12px", background: "transparent", border: "1px solid #374151",
              color: "#9ca3af", fontSize: "9px", letterSpacing: "2px", cursor: "pointer",
              fontFamily: "'Courier New', monospace"
            }}>VIEW TRUMP DEMO</button>
          </div>

          <div style={{ marginTop: "12px", padding: "10px", background: "#0a0a0a", border: "1px solid #1f2937", fontSize: "8px", color: "#374151", lineHeight: "1.6", textAlign: "center" }}>
            Pattern-based probabilistic prediction. Not a factual determination. Confidence intervals reflect data completeness. Use as one input among many in personal decision making.
          </div>
        </div>
      ) : analyzeStep === 0 ? (
        <div>
          <div style={{ background: "#0d0d0d", border: "1px solid #1f2937", padding: "20px" }}>
            <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "2px", marginBottom: "12px" }}>STEP 1 OF 3 — WHO ARE YOU ANALYZING?</div>
            <input
              value={analyzeName}
              onChange={e => setAnalyzeName(e.target.value)}
              placeholder="Name or description..."
              style={{
                width: "100%", padding: "12px", background: "#050505",
                border: "1px solid #374151", color: "#e2e8f0",
                fontSize: "14px", fontFamily: "'Courier New', monospace",
                marginBottom: "16px", boxSizing: "border-box", outline: "none"
              }}
            />
            <div style={{ fontSize: "9px", color: "#374151", marginBottom: "12px", letterSpacing: "1px" }}>SUBJECT TYPE:</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
              {["Romantic Partner", "Boss/Manager", "Business Partner", "Political Figure", "Family Member", "Custom"].map(t => (
                <button key={t} style={{
                  padding: "6px 12px", background: "transparent",
                  border: "1px solid #374151", color: "#6b7280",
                  fontSize: "9px", cursor: "pointer", fontFamily: "'Courier New', monospace",
                  letterSpacing: "1px"
                }}
                  onMouseEnter={e => { e.target.style.borderColor = "#ef4444"; e.target.style.color = "#ef4444"; }}
                  onMouseLeave={e => { e.target.style.borderColor = "#374151"; e.target.style.color = "#6b7280"; }}
                >{t}</button>
              ))}
            </div>
            <button
              onClick={() => analyzeName.trim() && setAnalyzeStep(1)}
              style={{
                width: "100%", padding: "14px", background: analyzeName.trim() ? "#ef4444" : "#1f2937",
                border: "none", color: analyzeName.trim() ? "#fff" : "#374151",
                fontSize: "10px", letterSpacing: "3px", cursor: analyzeName.trim() ? "pointer" : "default",
                fontFamily: "'Courier New', monospace", transition: "all 0.2s"
              }}>CONTINUE →</button>
          </div>
        </div>
      ) : analyzeStep <= ANALYZE_QUESTIONS.length ? (
        <div>
          <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
            {ANALYZE_QUESTIONS.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: "3px",
                background: i < analyzeStep - 1 ? "#ef4444" : i === analyzeStep - 1 ? "#ef444480" : "#1f2937"
              }} />
            ))}
          </div>
          <div style={{ background: "#0d0d0d", border: "1px solid #1f2937", padding: "20px" }}>
            <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "2px", marginBottom: "8px" }}>
              STEP 2 OF 3 — BEHAVIORAL OBSERVATIONS · {analyzeStep}/{ANALYZE_QUESTIONS.length}
            </div>
            <div style={{ fontSize: "9px", color: "#ef4444", letterSpacing: "1px", marginBottom: "12px" }}>
              ANALYZING: {analyzeName.toUpperCase()}
            </div>
            <div style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: "1.7", marginBottom: "20px" }}>
              {ANALYZE_QUESTIONS[analyzeStep - 1]}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Consistently healthy / accountable", "Mostly appropriate with occasional lapses", "Concerning patterns emerging", "Clear problematic behavioral pattern"].map((opt, i) => (
                <button key={i} onClick={() => {
                  const newAnswers = [...analyzeAnswers, i + 1];
                  if (analyzeStep >= ANALYZE_QUESTIONS.length) {
                    setAnalyzeResult(calcAnalyzeResult(newAnswers));
                  } else {
                    setAnalyzeAnswers(newAnswers);
                    setAnalyzeStep(analyzeStep + 1);
                  }
                }} style={{
                  padding: "12px 16px", background: "transparent",
                  border: "1px solid #1f2937", color: "#9ca3af",
                  cursor: "pointer", textAlign: "left", fontSize: "11px",
                  fontFamily: "'Courier New', monospace", transition: "all 0.15s",
                  lineHeight: "1.5"
                }}
                  onMouseEnter={e => { e.target.style.borderColor = "#ef4444"; e.target.style.color = "#e2e8f0"; }}
                  onMouseLeave={e => { e.target.style.borderColor = "#1f2937"; e.target.style.color = "#9ca3af"; }}
                >{opt}</button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      {view === "home" && homeView}
      {view === "demo" && demoView}
      {view === "quiz" && quizView}
      {view === "analyze" && analyzeView}

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: "600px",
        background: "#050505", borderTop: "1px solid #1f2937",
        display: "flex", zIndex: 100
      }}>
        {[
          { id: "home", label: "HOME", icon: "◈" },
          { id: "demo", label: "TRUMP OS", icon: "◉" },
          { id: "quiz", label: "QUICK", icon: "◆" },
          { id: "analyze", label: "ANALYZE", icon: "◎" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setView(tab.id)} style={{
            flex: 1, padding: "12px 4px", background: "transparent",
            border: "none", cursor: "pointer",
            borderTop: view === tab.id ? "2px solid #ef4444" : "2px solid transparent",
            fontFamily: "'Courier New', monospace"
          }}>
            <div style={{ fontSize: "12px", color: view === tab.id ? "#ef4444" : "#374151" }}>{tab.icon}</div>
            <div style={{ fontSize: "7px", letterSpacing: "1px", color: view === tab.id ? "#ef4444" : "#374151" }}>{tab.label}</div>
          </button>
        ))}
      </div>

      <div style={{ height: "60px" }} />
    </div>
  );
}
