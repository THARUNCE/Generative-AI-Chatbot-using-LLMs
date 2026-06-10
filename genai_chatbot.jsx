import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPTS = {
  general: "You are an intelligent AI assistant built as part of a Generative AI chatbot project using LLMs, LangChain, and Azure OpenAI. Be helpful, concise, and accurate. When relevant, relate answers to AI/ML concepts.",
  coding: "You are an expert AI coding assistant specializing in Python, LangChain, OpenAI API, Azure OpenAI, and LLM integrations. Provide clean, well-commented code examples. Explain technical concepts clearly. Focus on best practices for GenAI development.",
  data: "You are a data science and ML expert assistant. Help analyze data, explain statistical concepts, suggest ML approaches, and provide Python code using pandas, scikit-learn, and related libraries. Be precise and data-driven.",
  custom: "",
};

const PROMPT_LABELS = {
  general: "🤖 General Assistant",
  coding: "💻 Code Expert — Python, LangChain, APIs",
  data: "📊 Data Analyst — ML & Statistics",
  custom: "✏️ Custom prompt...",
};

const QUICK_CHIPS = [
  "Explain how LangChain chains work",
  "What is prompt engineering?",
  "How does RAG work?",
  "Azure vs OpenAI API differences",
  "Write a Python LangChain memory example",
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [systemKey, setSystemKey] = useState("general");
  const [customPrompt, setCustomPrompt] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getSystemPrompt = () =>
    systemKey === "custom" ? customPrompt : SYSTEM_PROMPTS[systemKey];

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");
    setError("");

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: getSystemPrompt(),
          messages: newMessages,
        }),
      });

      const data = await res.json();

      if (data?.content?.[0]?.text) {
        setMessages([...newMessages, { role: "assistant", content: data.content[0].text }]);
      } else {
        setError(data?.error?.message || "Unexpected response from API.");
        setMessages(newMessages.slice(0, -1));
      }
    } catch (e) {
      setError("Network error. Please try again.");
      setMessages(newMessages.slice(0, -1));
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const s = {
    root: {
      fontFamily: "'JetBrains Mono', 'Fira Mono', monospace",
      background: "#0d1117",
      borderRadius: 16,
      border: "0.5px solid #30363d",
      display: "flex",
      flexDirection: "column",
      minHeight: 580,
      overflow: "hidden",
    },
    header: {
      background: "#161b22",
      borderBottom: "0.5px solid #30363d",
      padding: "12px 18px",
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    dotsWrap: { display: "flex", gap: 6 },
    dot: (c) => ({ width: 12, height: 12, borderRadius: "50%", background: c }),
    headerTitle: { fontSize: 13, color: "#7d8590", marginLeft: 8 },
    badge: {
      marginLeft: "auto", fontSize: 11, background: "#1f2937",
      color: "#58a6ff", border: "0.5px solid #2563eb44",
      padding: "4px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 6,
    },
    pulse: {
      width: 7, height: 7, background: "#22c55e", borderRadius: "50%",
      animation: "pulse 2s infinite",
    },
    spBar: {
      background: "#0d1117", borderBottom: "0.5px solid #21262d",
      padding: "9px 18px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
    },
    spLabel: { fontSize: 11, color: "#f0883e", flexShrink: 0 },
    spSelect: {
      fontSize: 12, background: "#161b22", color: "#c9d1d9",
      border: "0.5px solid #30363d", borderRadius: 6, padding: "5px 10px",
      cursor: "pointer", flex: 1, minWidth: 200, fontFamily: "inherit",
    },
    customInput: {
      flex: 1, fontSize: 12, background: "#161b22", color: "#c9d1d9",
      border: "0.5px solid #30363d", borderRadius: 6, padding: "5px 10px",
      fontFamily: "inherit",
    },
    msgArea: {
      flex: 1, overflowY: "auto", padding: 18,
      display: "flex", flexDirection: "column", gap: 14,
      minHeight: 320, maxHeight: 420,
    },
    welcome: { textAlign: "center", padding: "28px 10px" },
    welcomeIcon: { fontSize: 32, marginBottom: 10 },
    welcomeTitle: { fontSize: 17, fontWeight: 600, color: "#e2e8f0", marginBottom: 6 },
    welcomeSub: { fontSize: 12, color: "#484f58", marginBottom: 18 },
    chips: { display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" },
    chip: {
      background: "#161b22", border: "0.5px solid #30363d", color: "#7d8590",
      fontSize: 12, padding: "6px 13px", borderRadius: 20, cursor: "pointer",
      fontFamily: "inherit", transition: "all 0.15s",
    },
    msgWrapUser: { alignSelf: "flex-end", display: "flex", flexDirection: "column", alignItems: "flex-end", maxWidth: "86%", gap: 4, animation: "fadeIn 0.2s ease" },
    msgWrapAI: { alignSelf: "flex-start", display: "flex", flexDirection: "column", alignItems: "flex-start", maxWidth: "86%", gap: 4, animation: "fadeIn 0.2s ease" },
    msgLabel: { fontSize: 10, color: "#484f58", textTransform: "uppercase", letterSpacing: "0.05em" },
    bubbleUser: {
      background: "#1d4ed844", border: "0.5px solid #1d4ed877",
      color: "#e2e8f0", padding: "11px 15px", borderRadius: "12px 12px 4px 12px",
      fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap",
    },
    bubbleAI: {
      background: "#161b22", border: "0.5px solid #30363d",
      color: "#c9d1d9", padding: "11px 15px", borderRadius: "12px 12px 12px 4px",
      fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap",
    },
    typing: {
      background: "#161b22", border: "0.5px solid #30363d",
      padding: "11px 15px", borderRadius: "12px 12px 12px 4px",
      display: "flex", gap: 5, alignItems: "center",
    },
    typingDot: (i) => ({
      width: 6, height: 6, background: "#58a6ff", borderRadius: "50%",
      animation: `bounce 1.2s infinite ${i * 0.2}s`,
    }),
    errBubble: {
      background: "#2d0f0f", border: "0.5px solid #ff7b7244",
      color: "#ff7b72", borderRadius: 8, padding: "9px 13px",
      fontSize: 12, alignSelf: "flex-start", maxWidth: "86%",
    },
    inputArea: { background: "#161b22", borderTop: "0.5px solid #30363d", padding: "12px 18px" },
    inputRow: { display: "flex", gap: 9, alignItems: "flex-end" },
    textarea: {
      flex: 1, background: "#0d1117", border: "0.5px solid #30363d",
      borderRadius: 10, color: "#c9d1d9", fontFamily: "inherit",
      fontSize: 13, padding: "10px 14px", resize: "none",
      minHeight: 42, maxHeight: 120, lineHeight: 1.5, outline: "none",
    },
    sendBtn: {
      background: loading ? "#21262d" : "#1d4ed8",
      border: "none", borderRadius: 10, color: "white",
      width: 42, height: 42, display: "flex", alignItems: "center",
      justifyContent: "center", cursor: loading ? "not-allowed" : "pointer",
      flexShrink: 0, fontSize: 18, transition: "background 0.15s",
    },
    inputFooter: { display: "flex", justifyContent: "space-between", marginTop: 7 },
    hint: { fontSize: 10, color: "#30363d" },
    clearBtn: {
      fontSize: 11, color: "#484f58", background: "none",
      border: "none", cursor: "pointer", fontFamily: "inherit",
    },
  };

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <div style={s.root}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.dotsWrap}>
            <div style={s.dot("#ff5f57")} />
            <div style={s.dot("#febc2e")} />
            <div style={s.dot("#28c840")} />
          </div>
          <span style={s.headerTitle}>genai-chatbot ~ llm-terminal</span>
          <div style={s.badge}>
            <div style={s.pulse} />
            claude-sonnet-4
          </div>
        </div>

        {/* System prompt bar */}
        <div style={s.spBar}>
          <span style={s.spLabel}>SYSTEM PROMPT ▸</span>
          <select
            style={s.spSelect}
            value={systemKey}
            onChange={(e) => setSystemKey(e.target.value)}
          >
            {Object.entries(PROMPT_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          {systemKey === "custom" && (
            <input
              style={s.customInput}
              placeholder="Enter custom system prompt..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
          )}
        </div>

        {/* Messages */}
        <div style={s.msgArea}>
          {messages.length === 0 && (
            <div style={s.welcome}>
              <div style={s.welcomeIcon}>⚡</div>
              <div style={s.welcomeTitle}>Generative AI Chatbot</div>
              <div style={s.welcomeSub}>// LangChain · Azure OpenAI · Prompt Engineering</div>
              <div style={s.chips}>
                {QUICK_CHIPS.map((c) => (
                  <button key={c} style={s.chip} onClick={() => sendMessage(c)}>{c}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={m.role === "user" ? s.msgWrapUser : s.msgWrapAI}>
              <span style={s.msgLabel}>{m.role === "user" ? "▸ you" : "◆ ai"}</span>
              <div style={m.role === "user" ? s.bubbleUser : s.bubbleAI}>{m.content}</div>
            </div>
          ))}

          {loading && (
            <div style={s.msgWrapAI}>
              <span style={s.msgLabel}>◆ ai</span>
              <div style={s.typing}>
                <div style={s.typingDot(0)} />
                <div style={s.typingDot(1)} />
                <div style={s.typingDot(2)} />
              </div>
            </div>
          )}

          {error && <div style={s.errBubble}>⚠ {error}</div>}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={s.inputArea}>
          <div style={s.inputRow}>
            <textarea
              ref={textareaRef}
              style={s.textarea}
              placeholder="Ask me anything about LLMs, LangChain, Azure OpenAI..."
              value={input}
              rows={1}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKey}
            />
            <button style={s.sendBtn} onClick={() => sendMessage()} disabled={loading} aria-label="Send">
              <i className="ti ti-send" aria-hidden="true" />
            </button>
          </div>
          <div style={s.inputFooter}>
            <span style={s.hint}>
              {loading ? "⏳ generating..." : `↵ enter to send · ${Math.floor(messages.length / 2)} turns in memory`}
            </span>
            <button style={s.clearBtn} onClick={() => { setMessages([]); setError(""); }}>
              clear conversation
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
