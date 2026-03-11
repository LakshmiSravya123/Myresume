import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NeuralNetwork from '@/components/NeuralNetwork';
import CursorGlow from '@/components/CursorGlow';
import BootSequence from '@/components/BootSequence';
import TerminalWindow from '@/components/TerminalWindow';
import IdentityTab from '@/components/tabs/IdentityTab';
import ProjectsTab from '@/components/tabs/ProjectsTab';
import ExperienceTab from '@/components/tabs/ExperienceTab';
import PresenceTab from '@/components/tabs/PresenceTab';
import InterfaceTab from '@/components/tabs/InterfaceTab';
import StudioTab from '@/components/tabs/StudioTab';

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
  hack          — !!!`;

// Matrix rain canvas overlay
function MatrixOverlay({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.98 ? '#fff' : `hsl(120, 100%, ${30 + Math.random() * 40}%)`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    const timeout = setTimeout(onDone, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer"
      onClick={onDone}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <div className="text-green-400 font-mono text-2xl mb-2" style={{ textShadow: '0 0 20px #0f0' }}>
          Wake up, Neo...
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="text-green-300/60 font-mono text-sm"
        >
          The Matrix has you.
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
          className="text-green-500/40 font-mono text-xs mt-4"
        >
          Follow the white rabbit...
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 1] }}
          transition={{ delay: 6, duration: 2 }}
          className="text-green-600/30 font-mono text-[10px] mt-6"
        >
          [click anywhere to escape]
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Hack effect overlay
function HackOverlay({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const hackLines = [
      '> Initiating breach protocol...',
      '> Scanning ports: 22, 80, 443, 8080...',
      '> Port 443 — OPEN',
      '> Injecting payload: 0xDEADBEEF...',
      '> Bypassing firewall... [████████░░] 80%',
      '> Bypassing firewall... [██████████] 100%',
      '> ACCESS GRANTED',
      '> Downloading mainframe...',
      '> root@sravya-portfolio:~# whoami',
      '> ERROR: You\'ve been reverse-hacked.',
      '> Your webcam light just flickered.',
      '> Just kidding. Nice try though.',
      '> ...',
      '> But seriously, hire me.',
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < hackLines.length) {
        setLines((prev) => [...prev, hackLines[i]]);
        i++;
        if (i === 7) setPhase(1); // ACCESS GRANTED
        if (i === 10) setPhase(2); // reverse hacked
      } else {
        clearInterval(interval);
        setTimeout(onDone, 3000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer"
      onClick={onDone}
      style={{
        background: phase >= 2 ? '#0a0a0a' : phase >= 1 ? '#0a0000' : '#0a0a0a',
        transition: 'background 0.5s',
      }}
    >
      <div className="font-mono text-sm max-w-lg w-full px-8">
        {/* Fake terminal header */}
        <div className="mb-4 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
          <span className="text-white/30 text-xs ml-2">hacker@terminal</span>
        </div>

        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="leading-relaxed"
            style={{
              color: line.includes('ACCESS GRANTED')
                ? '#4ade80'
                : line.includes('ERROR') || line.includes('reverse-hacked')
                ? '#f87171'
                : line.includes('hire me')
                ? '#00d4ff'
                : line.includes('Just kidding')
                ? '#fbbf24'
                : '#6b7280',
              textShadow: line.includes('ACCESS GRANTED')
                ? '0 0 10px #4ade80'
                : line.includes('ERROR')
                ? '0 0 10px #f87171'
                : 'none',
              fontSize: line.includes('ACCESS GRANTED') ? '1.1rem' : '0.875rem',
              fontWeight: line.includes('ACCESS GRANTED') || line.includes('hire me') ? 700 : 400,
            }}
          >
            {line}
          </motion.div>
        ))}

        {/* Blinking cursor */}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block mt-1"
          style={{ color: phase >= 2 ? '#f87171' : '#4ade80' }}
        >
          _
        </motion.span>
      </div>
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
          style={{ background: '#a855f7' }}
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
  const [booted, setBooted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>('identity');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [overlay, setOverlay] = useState<'matrix' | 'hack' | null>(null);

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
      </AnimatePresence>
    </div>
  );
}
