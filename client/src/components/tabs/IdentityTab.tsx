import { motion } from 'framer-motion';
import { TypeWriter, ScrambleText } from '@/components/TextEffects';

const CYAN = '#00d4ff';
const GREEN = '#4ade80';
const GRAY = '#6b7280';

const links = [
  { name: 'github.md', href: 'https://github.com/LakshmiSravyaVedantham' },
  { name: 'linkedin.md', href: 'https://www.linkedin.com/in/lakshmisravyavedantham' },
  { name: 'email.md', href: 'mailto:lakshmisravya.vedantham@gmail.com' },
  { name: 'devto.md', href: 'https://dev.to/lakshmisravyavedantham' },
];

const domains = [
  { label: 'Agentic AI', color: CYAN, glow: true },
  { label: 'Video Generation', color: GREEN, glow: false },
  { label: 'RAG Pipelines', color: CYAN, glow: false },
  { label: 'Multi-Agent Systems', color: GREEN, glow: false },
  { label: 'LLM Orchestration', color: CYAN, glow: false },
  { label: 'ML Infrastructure', color: GREEN, glow: false },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function IdentityTab() {
  return (
    <motion.div
      key="identity"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="h-full flex flex-col font-mono select-none overflow-y-auto overflow-x-hidden"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4"
      >
        {/* whoami — ASCII name */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <TypeWriter text="whoami" speed={60} className="text-white" />
          </div>
          <div className="mt-2 ml-2 glitch-text">
            <pre
              className="text-[9px] sm:text-[11px] md:text-xs leading-none font-bold"
              style={{
                lineHeight: 1.15,
                background: 'linear-gradient(90deg, #00d4ff, #4ade80, #00d4ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 3s ease infinite',
              }}
            >{` ____
/ ___|_ __ __ ___   ___   _  __ _
\\___ \\ '__/ _\` \\ \\ / / | | |/ _\` |
 ___) | | | (_| |\\ V /| |_| | (_| |
|____/|_|  \\__,_| \\_/  \\__, |\\__,_|
                        |___/       `}</pre>
          </div>
          <div className="ml-4 mt-1">
            <span className="text-white/40 text-xs">
              Lakshmi Sravya Vedantham
            </span>
          </div>
        </motion.div>

        {/* title + location inline */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">cat role.conf</span>
          </div>
          <div className="ml-4 mt-1.5 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span style={{ color: CYAN }} className="text-xs">[ROLE]</span>
              <span className="text-white text-base font-semibold">
                AI & Data Science Engineer
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: CYAN }} className="text-xs">[LOCATION]</span>
              <span style={{ color: GRAY }} className="text-sm">
                San Jose, California
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: CYAN }} className="text-xs">[STATUS]</span>
              <span className="flex items-center gap-1.5">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: GREEN }}
                />
                <span style={{ color: GREEN }} className="text-sm">
                  Open to new ideas &amp; collaborations
                </span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* core domains */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">cat /proc/expertise</span>
          </div>
          <div className="ml-4 mt-2 flex flex-wrap gap-2">
            {domains.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                className="px-3 py-1.5 rounded text-xs font-semibold"
                style={{
                  color: d.color,
                  border: `1px solid ${d.color}33`,
                  background: `${d.color}0a`,
                  boxShadow: d.glow ? `0 0 12px ${d.color}20, 0 0 4px ${d.color}15` : 'none',
                }}
              >
                {d.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* current mission */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">tail -f ~/.mission</span>
          </div>
          <div
            className="ml-4 mt-2 p-3 rounded text-sm"
            style={{
              border: `1px solid ${CYAN}1a`,
              background: `${CYAN}05`,
            }}
          >
            <div className="flex flex-col gap-1.5">
              <div>
                <span style={{ color: CYAN }}>{'>'}</span>{' '}
                <span className="text-white/80">
                  Building{' '}
                  <span style={{ color: CYAN }} className="font-semibold">
                    autonomous AI agents
                  </span>{' '}
                  that reason, plan, and execute
                </span>
              </div>
              <div>
                <span style={{ color: CYAN }}>{'>'}</span>{' '}
                <span className="text-white/80">
                  Researching{' '}
                  <span style={{ color: GREEN }} className="font-semibold">
                    AI video generation
                  </span>{' '}
                  & multimodal intelligence
                </span>
              </div>
              <div>
                <span style={{ color: CYAN }}>{'>'}</span>{' '}
                <span className="text-white/80">
                  Shipping products at the intersection of{' '}
                  <span style={{ color: GREEN }}>AI + creativity</span>
                </span>
              </div>
              <div className="mt-1">
                <span style={{ color: GRAY }}>{'#'}</span>{' '}
                <ScrambleText
                  text="Something big is in the works. Stay tuned."
                  delay={2200}
                  className="text-white/50 text-xs italic"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* stats bar */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">htop --summary</span>
          </div>
          <div className="ml-4 mt-2 flex gap-6 text-xs">
            {[
              { label: 'UPTIME', value: '8+ yrs', color: GREEN },
              { label: 'REPOS', value: '50+', color: CYAN },
              { label: 'ARTICLES', value: '33', color: GREEN },
              { label: 'AGENTS', value: 'ACTIVE', color: CYAN },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 + i * 0.15 }}
                className="flex flex-col items-center gap-0.5"
              >
                <span style={{ color: GRAY }}>{stat.label}</span>
                <span style={{ color: stat.color }} className="font-bold text-sm">
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* links */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">ls links/</span>
          </div>
          <div className="ml-4 mt-2 flex flex-wrap gap-x-6 gap-y-1">
            {links.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 + i * 0.1 }}
                className="text-sm transition-all duration-200 hover:text-[#00d4ff] hover:text-glow-cyan"
                style={{ color: '#94a3b8' }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
