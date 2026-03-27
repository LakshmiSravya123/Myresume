import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NeuralNetwork from '@/components/NeuralNetwork';
import CursorGlow from '@/components/CursorGlow';
import TerminalWindow from '@/components/TerminalWindow';
import IdentityTab from '@/components/tabs/IdentityTab';
import ProjectsTab from '@/components/tabs/ProjectsTab';
import ExperienceTab from '@/components/tabs/ExperienceTab';
import PresenceTab from '@/components/tabs/PresenceTab';
import InterfaceTab from '@/components/tabs/InterfaceTab';
import StudioTab from '@/components/tabs/StudioTab';
import TronGame from '@/components/TronGame';

const TAB_NAMES = [
  'identity',
  'interface',
  'projects',
  'experience',
  'presence',
  'studio',
] as const;

type TabName = (typeof TAB_NAMES)[number];

const TAB_COMPONENTS: Record<TabName, () => JSX.Element> = {
  identity: IdentityTab,
  projects: ProjectsTab,
  experience: ExperienceTab,
  presence: PresenceTab,
  interface: InterfaceTab,
  studio: StudioTab,
};

// Command aliases that map to tab names
const TAB_ALIASES: Record<string, TabName> = {
  whoami: 'identity',
  home: 'identity',
  about: 'identity',
  'ls projects': 'projects',
  projects: 'projects',
  repos: 'projects',
  'git log': 'experience',
  experience: 'experience',
  work: 'experience',
  career: 'experience',
  blog: 'presence',
  presence: 'presence',
  articles: 'presence',
  'dev.to': 'presence',
  chat: 'interface',
  ask: 'interface',
  ai: 'interface',
  studio: 'studio',
  youtube: 'studio',
  dumdumhum: 'studio',
  videogen: 'studio',
  videos: 'studio',
};

const HELP_TEXT = `Available commands:
  help          — show this message
  whoami        — identity / about me
  projects      — featured projects & GitHub repos
  experience    — work history (git log style)
  presence      — blog posts & online presence
  chat          — ask the AI about me
  studio        — video gen & YouTube channel
  clear         — reset terminal
  resume        — download resume
  open github   — open GitHub profile
  open linkedin — open LinkedIn profile
  sudo          — try it ;)
  matrix        — ???
  hack          — !!!
  tron          — survive the grid`;

// ═══════════════════════════════════════════════════════
// MATRIX — full immersive experience
// ═══════════════════════════════════════════════════════
function MatrixOverlay({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),    // rain starts
      setTimeout(() => setPhase(2), 2500),    // "wake up"
      setTimeout(() => setPhase(3), 5000),    // "follow the rabbit"
      setTimeout(() => setPhase(4), 8000),    // "knock knock"
      setTimeout(() => setPhase(5), 11000),   // glitch intensifies
      setTimeout(() => {
        setExiting(true);
        setTimeout(onDone, 1500);
      }, 14000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  // Canvas rain
  useEffect(() => {
    if (phase < 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
    const fontSize = 13;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];
    const speeds: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops.push(Math.random() * -100);
      speeds.push(0.5 + Math.random() * 1.5);
    }

    let frame = 0;
    const draw = () => {
      // Slower fade = longer trails
      ctx.fillStyle = phase >= 5 ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const y = drops[i] * fontSize;

        // Head of the stream is bright white
        if (Math.random() > 0.7) {
          ctx.fillStyle = '#ffffff';
          ctx.fillText(char, i * fontSize, y);
        }
        // Main character
        const brightness = phase >= 5 ? 50 + Math.random() * 50 : 30 + Math.random() * 40;
        ctx.fillStyle = `hsl(120, 100%, ${brightness}%)`;
        ctx.fillText(char, i * fontSize, y);

        // Random flicker — redraw a random old position
        if (Math.random() > 0.98) {
          const flickerY = Math.random() * canvas.height;
          ctx.fillStyle = `hsl(120, 100%, ${60 + Math.random() * 30}%)`;
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, flickerY);
        }

        drops[i] += speeds[i];
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = Math.random() * -20;
          speeds[i] = 0.5 + Math.random() * 1.5;
        }
      }
      frame++;
      animId = requestAnimationFrame(draw);
    };

    let animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [phase]);

  const handleExit = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onDone, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: exiting ? 0 : 1,
        filter: exiting ? 'brightness(3) blur(10px)' : 'brightness(1) blur(0px)',
      }}
      transition={{ duration: exiting ? 0.8 : 0.3 }}
      className="fixed inset-0 z-[9999] cursor-pointer overflow-hidden"
      onClick={handleExit}
      style={{ background: '#000' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Screen flicker on entry */}
      {phase === 0 && (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0, 1, 0, 0.8, 0, 1, 0] }}
          transition={{ duration: 0.6 }}
          style={{ background: '#000' }}
        />
      )}

      {/* Horizontal scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] pointer-events-none"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ background: 'rgba(0, 255, 0, 0.08)' }}
      />

      {/* Text overlays */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center relative z-10">
          {/* Phase 2: Wake up */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: phase >= 4 ? 0.3 : 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="font-mono text-3xl sm:text-5xl font-bold mb-6"
              style={{ color: '#0f0', textShadow: '0 0 30px #0f0, 0 0 60px #0a0, 0 0 100px #050' }}
            >
              Wake up, Neo...
            </motion.div>
          )}

          {/* Phase 3: Matrix has you */}
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.15em' }}
              transition={{ duration: 1.5 }}
              className="font-mono text-lg sm:text-xl mb-4"
              style={{ color: '#0f0', textShadow: '0 0 15px #0f0' }}
            >
              The Matrix has you.
            </motion.div>
          )}

          {/* Phase 4: Follow the rabbit */}
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.7, 1] }}
              transition={{ duration: 2 }}
              className="font-mono text-sm sm:text-base mb-8"
              style={{ color: '#0a0', textShadow: '0 0 10px #0f0' }}
            >
              Follow the white rabbit.
            </motion.div>
          )}

          {/* Phase 5: Knock knock */}
          {phase >= 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
              className="font-mono text-2xl sm:text-4xl font-black"
              style={{ color: '#fff', textShadow: '0 0 40px #0f0, 0 0 80px #0f0, 0 0 120px #050' }}
            >
              Knock, knock.
            </motion.div>
          )}

          {/* Escape hint */}
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 2 }}
              className="font-mono text-[10px] mt-12"
              style={{ color: '#0a0' }}
            >
              [ click to unplug ]
            </motion.div>
          )}
        </div>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// HACK — full immersive breach sequence
// ═══════════════════════════════════════════════════════
function HackOverlay({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<{ text: string; type: string }[]>([]);
  const [phase, setPhase] = useState(0); // 0=breach, 1=access, 2=reverse, 3=end
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState('');
  const [webcamDot, setWebcamDot] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sequence: { text: string; type: string; delay: number; action?: () => void }[] = [
      { text: '$ ./breach --target=sravya-portfolio --stealth', type: 'cmd', delay: 0 },
      { text: '[*] Initiating breach protocol v4.2.0...', type: 'info', delay: 600 },
      { text: '[*] Scanning ports: 22, 80, 443, 3000, 8080, 27017...', type: 'info', delay: 400 },
      { text: '[+] Port 22  — CLOSED (smart)', type: 'dim', delay: 200 },
      { text: '[+] Port 443 — OPEN', type: 'success', delay: 200 },
      { text: '[*] Attempting SSH bruteforce...', type: 'info', delay: 500 },
      { text: '[-] Failed. Trying SQL injection...', type: 'warn', delay: 400 },
      { text: '[-] Failed. Trying XSS payload...', type: 'warn', delay: 300 },
      { text: '[*] Injecting reverse shell: 0xDEADBEEF...', type: 'info', delay: 500 },
      { text: '[*] Bypassing WAF... [█░░░░░░░░░] 10%', type: 'info', delay: 300 },
      { text: '[*] Bypassing WAF... [████░░░░░░] 40%', type: 'info', delay: 250 },
      { text: '[*] Bypassing WAF... [███████░░░] 70%', type: 'info', delay: 250 },
      { text: '[*] Bypassing WAF... [██████████] 100%', type: 'success', delay: 300 },
      { text: '', type: 'blank', delay: 200 },
      { text: '    █████  ACCESS GRANTED  █████', type: 'access', delay: 100, action: () => { setPhase(1); setFlash('green'); setTimeout(() => setFlash(''), 300); } },
      { text: '', type: 'blank', delay: 400 },
      { text: 'root@sravya:~# cat /etc/shadow', type: 'cmd', delay: 500 },
      { text: '[*] Dumping credentials...', type: 'info', delay: 400 },
      { text: '[*] Downloading browser history...', type: 'info', delay: 300 },
      { text: '[*] Exfiltrating cookies...', type: 'info', delay: 300 },
      { text: '[*] Accessing webcam feed...', type: 'info', delay: 400, action: () => setWebcamDot(true) },
      { text: '', type: 'blank', delay: 300 },
      { text: '██ CRITICAL ERROR ██', type: 'error', delay: 100, action: () => { setPhase(2); setShake(true); setFlash('red'); setTimeout(() => { setShake(false); setFlash(''); }, 600); } },
      { text: '', type: 'blank', delay: 200 },
      { text: '[!] REVERSE TRACE DETECTED', type: 'error', delay: 300 },
      { text: '[!] YOUR IP HAS BEEN LOGGED: 127.0.0.1', type: 'error', delay: 300 },
      { text: '[!] Firewall counter-attack initiated...', type: 'error', delay: 300 },
      { text: '[!] YOUR WEBCAM LIGHT JUST FLICKERED.', type: 'error', delay: 500, action: () => { setWebcamDot(false); setTimeout(() => setWebcamDot(true), 200); setTimeout(() => setWebcamDot(false), 400); setTimeout(() => setWebcamDot(true), 600); } },
      { text: '', type: 'blank', delay: 800 },
      { text: '...', type: 'dim', delay: 600 },
      { text: 'Just kidding. You\'re safe.', type: 'calm', delay: 600, action: () => { setPhase(3); setWebcamDot(false); } },
      { text: 'But your hacking skills need work.', type: 'calm', delay: 500 },
      { text: '', type: 'blank', delay: 300 },
      { text: 'Maybe try hiring me instead? I build things, not break them.', type: 'cta', delay: 0 },
    ];

    let timeout: ReturnType<typeof setTimeout>;
    let idx = 0;

    const showNext = () => {
      if (idx >= sequence.length) {
        setTimeout(onDone, 4000);
        return;
      }
      const item = sequence[idx];
      setLines((prev) => [...prev, { text: item.text, type: item.type }]);
      item.action?.();
      idx++;
      if (idx < sequence.length) {
        timeout = setTimeout(showNext, sequence[idx].delay);
      } else {
        setTimeout(onDone, 4000);
      }
    };

    timeout = setTimeout(showNext, 500);
    return () => clearTimeout(timeout);
  }, [onDone]);

  const lineColor = (type: string) => {
    switch (type) {
      case 'cmd': return '#a855f7';
      case 'success': return '#4ade80';
      case 'access': return '#4ade80';
      case 'error': return '#f87171';
      case 'warn': return '#fbbf24';
      case 'calm': return '#fbbf24';
      case 'cta': return '#00d4ff';
      case 'dim': return '#4b5563';
      case 'blank': return 'transparent';
      default: return '#6b7280';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] cursor-pointer overflow-hidden"
      onClick={onDone}
    >
      {/* Background with phase-based color */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: phase >= 2
            ? 'radial-gradient(ellipse at center, #1a0000 0%, #0a0000 50%, #000 100%)'
            : phase >= 1
            ? 'radial-gradient(ellipse at center, #001a00 0%, #000a00 50%, #000 100%)'
            : '#0a0a0a',
        }}
      />

      {/* Full-screen flash */}
      {flash && (
        <motion.div
          className="absolute inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: flash === 'red' ? '#ff0000' : '#00ff00' }}
        />
      )}

      {/* Fake webcam indicator */}
      {webcamDot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-6 right-6 z-50 flex items-center gap-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="w-3 h-3 rounded-full"
            style={{ background: '#4ade80', boxShadow: '0 0 10px #4ade80, 0 0 20px #4ade80' }}
          />
          <span className="text-[10px] font-mono" style={{ color: '#4ade80' }}>WEBCAM ACTIVE</span>
        </motion.div>
      )}

      {/* Terminal content */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-start justify-center pt-[10vh] overflow-y-auto"
        style={{
          animation: shake ? 'shake 0.15s ease-in-out 4' : 'none',
        }}
      >
        <div className="font-mono text-xs sm:text-sm max-w-2xl w-full px-6">
          {/* Terminal chrome */}
          <div className="mb-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            <span className="text-white/20 text-[10px] ml-2 font-mono">root@breached — bash</span>
          </div>

          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className="leading-relaxed"
              style={{
                color: lineColor(line.type),
                textShadow: line.type === 'access'
                  ? '0 0 20px #4ade80, 0 0 40px #4ade80'
                  : line.type === 'error'
                  ? '0 0 10px #f87171'
                  : line.type === 'cta'
                  ? '0 0 10px #00d4ff'
                  : 'none',
                fontSize: line.type === 'access' ? '1.2rem' : line.type === 'cta' ? '1rem' : undefined,
                fontWeight: line.type === 'access' || line.type === 'error' || line.type === 'cta' ? 700 : 400,
                letterSpacing: line.type === 'access' ? '0.2em' : line.type === 'error' ? '0.05em' : undefined,
                minHeight: line.type === 'blank' ? '1rem' : undefined,
              }}
            >
              {line.text}
            </motion.div>
          ))}

          {/* Cursor */}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            className="inline-block mt-1"
            style={{ color: phase >= 2 ? '#f87171' : phase >= 1 ? '#4ade80' : '#6b7280' }}
          >
            _
          </motion.span>
        </div>
      </div>

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
        }}
      />
    </motion.div>
  );
}

// Brief "thinking" flash between tab switches
function NeuralFlash() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 flex items-center justify-center z-20"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.4, repeat: 1 }}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#00d4ff' }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.4, repeat: 1, delay: 0.1 }}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#4ade80' }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.4, repeat: 1, delay: 0.2 }}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#00d4ff' }}
        />
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [booted, setBooted] = useState(true);
  const [activeTab, setActiveTab] = useState<TabName>('identity');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [overlay, setOverlay] = useState<'matrix' | 'hack' | 'tron' | null>(null);

  const switchTab = useCallback((tab: TabName) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 300);
  }, [activeTab]);

  const handleCommand = useCallback(
    (raw: string): string | null => {
      const cmd = raw.toLowerCase().trim();

      // Tab navigation commands
      const tab = TAB_ALIASES[cmd];
      if (tab) {
        switchTab(tab);
        return `> navigating to ${tab}...`;
      }

      // Special commands
      switch (cmd) {
        case 'help':
        case '--help':
        case '-h':
          return HELP_TEXT;

        case 'clear':
          switchTab('identity');
          return null;

        case 'resume':
        case 'cat resume':
        case 'cat resume.pdf': {
          const a = document.createElement('a');
          a.href = '/resume.pdf';
          a.download = 'Sravya_Vedantham_Resume.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          return '> downloading Sravya_Vedantham_Resume.pdf...';
        }

        case 'open github':
        case 'github':
          window.open('https://github.com/LakshmiSravyaVedantham', '_blank');
          return '> opening github.com/LakshmiSravyaVedantham...';

        case 'open linkedin':
        case 'linkedin':
          window.open('https://www.linkedin.com/in/lakshmisravyavedantham', '_blank');
          return '> opening linkedin profile...';

        case 'open email':
        case 'email':
          window.open('mailto:lakshmisravya.vedantham@gmail.com', '_blank');
          return '> composing email...';

        // Easter eggs
        case 'sudo':
        case 'sudo su':
        case 'sudo rm -rf /':
          return '> nice try. Permission denied. This is a portfolio, not a server.';

        case 'matrix':
          setOverlay('matrix');
          return null;

        case 'hack':
        case 'hack nasa':
        case 'hack pentagon':
          setOverlay('hack');
          return null;

        case 'tron':
        case 'game':
        case 'play':
          setOverlay('tron');
          return null;

        case 'ls':
          return 'identity/  interface/  projects/  experience/  presence/  studio/';

        case 'pwd':
          return '/home/sravya/portfolio';

        case 'date':
          return `> ${new Date().toLocaleString()}`;

        case 'uptime':
          return '> 8 years of professional experience and counting...';

        case 'ping':
          return '> PONG! Latency: 0ms (I\'m right here)';

        case 'exit':
        case 'quit':
          return '> You can close this tab, but you\'ll miss out ;)';

        case 'cat /etc/passwd':
          return '> nice try, hacker. Audit logged.';

        case 'vim':
        case 'nano':
        case 'emacs':
          return `> ${cmd}: command not found. This terminal is read-only... mostly.`;

        case 'coffee':
        case 'brew coffee':
          return '> Brewing... [##########] 100%. Here you go: c[_]';

        case 'neofetch':
        case 'skills':
        case 'tech':
          return '> Python, TypeScript, React, TensorFlow, PyTorch, LangChain, Docker, K8s, RAG, FAISS...';

        default:
          if (cmd.startsWith('cd ')) {
            return `> cd: no such directory: ${cmd.slice(3)}. Try "ls" to see what's here.`;
          }
          if (cmd.startsWith('cat ')) {
            return `> ${cmd.slice(4)}: file not found. Try "help" for available commands.`;
          }
          if (cmd.startsWith('open ')) {
            return `> unknown target: ${cmd.slice(5)}. Try "open github" or "open linkedin".`;
          }
          return `> command not found: ${cmd}. Type "help" for available commands.`;
      }
    },
    [switchTab]
  );

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  // Boot sequence
  if (!booted) {
    return (
      <div
        className="h-screen w-screen overflow-hidden relative"
        style={{ background: 'var(--neural-bg)' }}
      >
        <NeuralNetwork />
        <div className="relative z-10 h-full w-full flex items-center justify-center px-4">
          <BootSequence onComplete={() => setBooted(true)} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden relative"
      style={{ background: 'var(--neural-bg)' }}
    >
      <NeuralNetwork activeTab={activeTab} />
      <CursorGlow />

      <div className="relative z-10 h-full w-full flex items-center justify-center px-4">
        <TerminalWindow
          tabs={[...TAB_NAMES]}
          activeTab={activeTab}
          onTabChange={(tab) => switchTab(tab as TabName)}
          onCommand={handleCommand}
        >
          <AnimatePresence mode="wait">
            {isTransitioning ? (
              <NeuralFlash key="flash" />
            ) : (
              <ActiveComponent key={activeTab} />
            )}
          </AnimatePresence>
        </TerminalWindow>
      </div>

      {/* Immersive overlays */}
      <AnimatePresence>
        {overlay === 'matrix' && (
          <MatrixOverlay key="matrix" onDone={() => setOverlay(null)} />
        )}
        {overlay === 'hack' && (
          <HackOverlay key="hack" onDone={() => setOverlay(null)} />
        )}
        {overlay === 'tron' && (
          <TronGame key="tron" onDone={() => setOverlay(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
