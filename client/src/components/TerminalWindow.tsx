import { type ReactNode, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COMMANDS = [
  'help', 'whoami', 'home', 'about', 'projects', 'repos',
  'experience', 'work', 'career', 'skills', 'neofetch', 'tech',
  'blog', 'presence', 'articles', 'chat', 'ask', 'ai',
  'clear', 'resume', 'ls', 'pwd', 'date', 'uptime', 'ping',
  'open github', 'open linkedin', 'open email',
  'sudo', 'matrix', 'hack', 'coffee', 'exit',
  'git log', 'ls projects', 'dev.to',
];

const HINTS = [
  "try 'help' to see all commands",
  "type 'whoami' to learn about me",
  "try 'projects' to see my work",
  "type 'matrix' for a surprise",
  "try 'coffee' — you deserve it",
  "type 'sudo' if you dare",
  "try 'chat' to talk to the AI",
  "type 'experience' to see my journey",
  "try 'hack' — see what happens",
  "type 'resume' to download my CV",
];

interface TerminalWindowProps {
  children: ReactNode;
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCommand?: (cmd: string) => string | null;
}

function NeuralMetrics() {
  const [load, setLoad] = useState(73);
  const [agents, setAgents] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoad(Math.floor(65 + Math.random() * 30));
      setAgents(Math.floor(3 + Math.random() * 4));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden sm:flex items-center gap-3 text-[9px] shrink-0">
      <span style={{ color: '#4b5563' }}>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ color: load > 85 ? '#f87171' : '#4ade80' }}
        >
          {'●'}
        </motion.span>
        {' '}Neural {load}%
      </span>
      <span style={{ color: '#4b5563' }}>
        Agents: <span style={{ color: '#00d4ff' }}>{agents}</span>
      </span>
      <span style={{ color: '#4b5563' }}>
        v2.0
      </span>
    </div>
  );
}

export default function TerminalWindow({
  children,
  tabs,
  activeTab,
  onTabChange,
  onCommand,
}: TerminalWindowProps) {
  const [cmdInput, setCmdInput] = useState('');
  const [cmdOutput, setCmdOutput] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hintIdx, setHintIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotate placeholder hints
  useEffect(() => {
    const t = setInterval(() => {
      setHintIdx((prev) => (prev + 1) % HINTS.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const suggestions = useMemo(() => {
    if (cmdInput.length < 1) return [];
    const lower = cmdInput.toLowerCase();
    return COMMANDS.filter((c) => c.startsWith(lower) && c !== lower).slice(0, 4);
  }, [cmdInput]);

  useEffect(() => {
    setShowSuggestions(suggestions.length > 0 && cmdInput.length > 0);
  }, [suggestions, cmdInput]);

  // Clear output after 3 seconds
  useEffect(() => {
    if (!cmdOutput) return;
    const t = setTimeout(() => setCmdOutput(null), 3000);
    return () => clearTimeout(t);
  }, [cmdOutput]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = cmdInput.trim();
      if (!trimmed) return;

      setHistory((prev) => [trimmed, ...prev].slice(0, 50));
      setHistoryIdx(-1);
      setShowSuggestions(false);

      if (onCommand) {
        const result = onCommand(trimmed);
        setCmdOutput(result);
      }

      setCmdInput('');
    },
    [cmdInput, onCommand]
  );

  const acceptSuggestion = useCallback((cmd: string) => {
    setCmdInput(cmd);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab' && suggestions.length > 0) {
        e.preventDefault();
        setCmdInput(suggestions[0]);
        setShowSuggestions(false);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next = Math.min(historyIdx + 1, history.length - 1);
        setHistoryIdx(next);
        if (history[next]) setCmdInput(history[next]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = historyIdx - 1;
        if (next < 0) {
          setHistoryIdx(-1);
          setCmdInput('');
        } else {
          setHistoryIdx(next);
          setCmdInput(history[next] || '');
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    },
    [history, historyIdx, suggestions]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl w-full h-[88vh] flex flex-col font-mono relative"
      style={{
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '0.75rem',
        boxShadow:
          '0 0 40px rgba(0, 212, 255, 0.06), 0 0 80px rgba(0, 0, 0, 0.4), 0 25px 50px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* CRT scanline overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-50"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Title bar */}
      <div
        className="flex items-center h-10 px-4 rounded-t-xl shrink-0"
        style={{
          background: 'rgba(30, 30, 40, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        </div>

        {/* Tabs */}
        <div className="flex-1 flex items-center justify-center gap-1">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className="relative px-3 py-1 text-xs transition-colors duration-200"
                style={{
                  color: isActive ? '#00d4ff' : '#6b7280',
                }}
              >
                <span className="relative z-10">{tab}</span>
                {isActive && (
                  <motion.div
                    layoutId="terminal-tab-indicator"
                    className="absolute bottom-0 left-1 right-1 h-[2px]"
                    style={{ background: '#00d4ff' }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Neural metrics */}
        <NeuralMetrics />
      </div>

      {/* Content area */}
      <div
        className="flex-1 overflow-hidden p-6 relative"
        style={{
          background: 'rgba(10, 10, 20, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {children}
      </div>

      {/* Command output flash */}
      <AnimatePresence>
        {cmdOutput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-1.5 text-xs shrink-0"
            style={{
              background: 'rgba(10, 10, 20, 0.95)',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              color: '#4ade80',
              whiteSpace: 'pre-wrap',
            }}
          >
            {cmdOutput}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Autocomplete suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="px-4 py-1 shrink-0 flex gap-3"
            style={{
              background: 'rgba(15, 15, 25, 0.98)',
              borderTop: '1px solid rgba(255, 255, 255, 0.03)',
            }}
          >
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => acceptSuggestion(s)}
                className="text-[10px] px-1.5 py-0.5 rounded transition-colors hover:text-[#00d4ff]"
                style={{ color: '#6b7280' }}
              >
                {s}
              </button>
            ))}
            <span className="text-[9px] ml-auto self-center" style={{ color: '#374151' }}>
              tab to complete
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command input bar */}
      <form
        onSubmit={handleSubmit}
        onClick={() => inputRef.current?.focus()}
        className="flex items-center gap-2 h-10 px-4 rounded-b-xl shrink-0 cursor-text"
        style={{
          background: 'rgba(20, 20, 30, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <span className="text-xs shrink-0" style={{ color: '#4ade80' }}>
          visitor@neural_os
        </span>
        <span className="text-xs shrink-0" style={{ color: '#6b7280' }}>:</span>
        <span className="text-xs shrink-0" style={{ color: '#00d4ff' }}>~</span>
        <span className="text-xs shrink-0" style={{ color: '#6b7280' }}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={cmdInput}
          onChange={(e) => setCmdInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={HINTS[hintIdx]}
          className="flex-1 bg-transparent text-xs text-white placeholder:text-white/15 font-mono outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          className="w-[7px] h-[14px] shrink-0"
          style={{ background: '#00d4ff' }}
        />
      </form>
    </motion.div>
  );
}
