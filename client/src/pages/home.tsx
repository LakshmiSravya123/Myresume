import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
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

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>('identity');

  const handleCommand = useCallback(
    (raw: string): string | null => {
      const cmd = raw.toLowerCase().trim();

      // Tab navigation commands
      const tab = TAB_ALIASES[cmd];
      if (tab) {
        setActiveTab(tab);
        return `> navigating to ${tab}...`;
      }

      // Special commands
      switch (cmd) {
        case 'help':
        case '--help':
        case '-h':
          return HELP_TEXT;

        case 'clear':
          setActiveTab('identity');
          return null;

        case 'resume':
        case 'cat resume':
        case 'cat resume.pdf':
          window.open('/resume.pdf', '_blank');
          return '> downloading resume.pdf...';

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
          document.body.style.transition = 'filter 0.5s';
          document.body.style.filter = 'hue-rotate(90deg) saturate(2)';
          setTimeout(() => {
            document.body.style.filter = '';
          }, 3000);
          return '> wake up, Neo... The Matrix has you...';

        case 'hack':
        case 'hack nasa':
          return '> ACCESS DENIED. Just kidding — I\'m a portfolio. Try "help" instead.';

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
    []
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
      <NeuralNetwork />
      <CursorGlow />

      <div className="relative z-10 h-full w-full flex items-center justify-center px-4">
        <TerminalWindow
          tabs={[...TAB_NAMES]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as TabName)}
          onCommand={handleCommand}
        >
          <AnimatePresence mode="wait">
            <ActiveComponent key={activeTab} />
          </AnimatePresence>
        </TerminalWindow>
      </div>
    </div>
  );
}
