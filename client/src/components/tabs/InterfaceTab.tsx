import { motion } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";
import { TextGenerate } from "@/components/TextEffects";
import GlassPanel from "@/components/GlassPanel";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  id: number;
}

const quickQuestions = [
  "What's your AI experience?",
  "Tell me about your projects",
  "What technologies do you use?",
  "What's your education?",
  "What are you passionate about?",
];

const contactLinks = [
  {
    label: "Email",
    value: "lakshmisravya.vedantham@gmail.com",
    href: "mailto:lakshmisravya.vedantham@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "San Jose, California",
    href: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: "LakshmiSravyaVedantham",
    href: "https://github.com/LakshmiSravyaVedantham",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "sravya-vedantham",
    href: "https://linkedin.com/in/sravya-vedantham",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function InterfaceTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [latestResponseId, setLatestResponseId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim() || isLoading) return;

      const userMsgId = ++messageIdRef.current;
      const userMessage: ChatMessage = {
        role: "user",
        content: query.trim(),
        id: userMsgId,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/quick-action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query.trim() }),
        });

        const data = await res.json();
        const assistantMsgId = ++messageIdRef.current;
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.response ?? "I can help answer questions about Sravya's experience and skills.",
          id: assistantMsgId,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setLatestResponseId(assistantMsgId);
      } catch {
        const errorMsgId = ++messageIdRef.current;
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Connection interrupted. Please try again.",
            id: errorMsgId,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <motion.div
      key="interface"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex items-center justify-center h-screen px-8 select-none"
    >
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 items-center">
        {/* LEFT — Contact Info */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          <motion.div variants={fadeUp}>
            <h2 className="text-3xl font-display font-bold gradient-text-cyan">
              Interface
            </h2>
            <p className="font-mono text-xs text-cyan-400/50 mt-1">
              // connect.init()
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-2">
            {contactLinks.map((link) => {
              const content = (
                <GlassPanel className="flex items-center gap-3 px-4 py-2.5 group transition-all duration-300 hover:border-cyan-400/20">
                  <span className="text-cyan-400/70 group-hover:text-cyan-400 transition-colors">
                    {link.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#475569]">
                      {link.label}
                    </p>
                    <p className="text-sm text-[#c4d0e0] truncate">
                      {link.value}
                    </p>
                  </div>
                  {link.href && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-3 h-3 text-[#475569] ml-auto shrink-0 group-hover:text-cyan-400 transition-colors"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  )}
                </GlassPanel>
              );

              return link.href ? (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeUp}
                  whileHover={{ x: 4 }}
                >
                  {content}
                </motion.a>
              ) : (
                <motion.div key={link.label} variants={fadeUp}>
                  {content}
                </motion.div>
              );
            })}
          </motion.div>

          <motion.a
            variants={fadeUp}
            href="/api/resume/download"
            className="glass-strong flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-mono text-cyan-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:text-white hover:border-cyan-400/40"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Resume
          </motion.a>
        </motion.div>

        {/* RIGHT — AI Chat */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col glass rounded-xl overflow-hidden"
          style={{ height: "min(480px, 65vh)" }}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs text-[#64748b]">
              neural_chat v1.0
            </span>
            <span className="font-mono text-[10px] text-emerald-400/60 ml-auto">
              online
            </span>
          </div>

          {/* Chat messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <p className="text-[#475569] text-sm">
                  Ask me anything about Sravya's experience
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                  {quickQuestions.map((q) => (
                    <motion.button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="glass text-[11px] text-[#94a3b8] px-3 py-1.5 rounded-full transition-all duration-300 hover:text-cyan-400 hover:border-cyan-400/30 hover:shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-cyan-400/10 text-cyan-100 border border-cyan-400/20"
                      : "glass text-[#c4d0e0]"
                  }`}
                >
                  {msg.role === "assistant" && msg.id === latestResponseId ? (
                    <TextGenerate text={msg.content} delay={0} />
                  ) : (
                    msg.content
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="glass rounded-lg px-3 py-2 text-sm text-[#64748b]">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    analyzing...
                  </motion.span>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick actions when there are messages */}
          {messages.length > 0 && (
            <div className="flex gap-1.5 px-4 py-2 border-t border-white/5 overflow-x-auto">
              {quickQuestions.slice(0, 3).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={isLoading}
                  className="glass text-[10px] text-[#64748b] px-2 py-1 rounded-full whitespace-nowrap shrink-0 transition-colors hover:text-cyan-400 hover:border-cyan-400/20 disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-3 border-t border-white/5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#334155] font-mono outline-none border-b border-cyan-400/20 pb-1 focus:border-cyan-400/50 transition-colors disabled:opacity-50"
            />
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="text-cyan-400/50 hover:text-cyan-400 transition-colors disabled:opacity-30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
