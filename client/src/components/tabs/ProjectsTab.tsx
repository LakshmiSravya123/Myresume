import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import type { ResumeData } from '@shared/schema';

const CYAN = '#00d4ff';
const GRAY = '#6b7280';
const GREEN = '#4ade80';

interface GitHubProject {
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
  updated_at: string;
}

const langColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  Dart: '#0175c2',
  Rust: '#dea584',
  Go: '#00add8',
  Java: '#b07219',
  Unknown: '#6b7280',
};

function shortHash(): string {
  return Math.random().toString(16).slice(2, 9);
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ProjectsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: portfolio } = useQuery<ResumeData>({
    queryKey: ['/api/portfolio'],
  });

  const { data: githubProjects } = useQuery<GitHubProject[]>({
    queryKey: ['/api/github/projects'],
  });

  const featured = portfolio?.projects ?? [];
  const repos = githubProjects ?? [];

  return (
    <motion.div
      key="projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="h-full flex flex-col font-mono select-none overflow-hidden"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 h-full"
      >
        {/* Featured projects header */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">ls -la ~/projects/featured/</span>
          </div>
        </motion.div>

        {/* Featured listing */}
        <motion.div variants={fadeIn} className="ml-2">
          {featured.map((project) => (
            <div key={project.name}>
              <button
                onClick={() =>
                  setExpanded(expanded === project.name ? null : project.name)
                }
                className="w-full text-left text-sm py-0.5 hover:bg-white/[0.02] transition-colors flex items-center gap-2"
              >
                <span style={{ color: GRAY }} className="text-xs w-[110px] shrink-0">
                  drwxr-xr-x
                </span>
                <span style={{ color: GRAY }} className="text-xs w-[52px] shrink-0">
                  sravya
                </span>
                <span style={{ color: GRAY }} className="text-xs w-[36px] shrink-0">
                  {project.year ?? '2025'}
                </span>
                <span className="text-white truncate">{project.name}</span>
                <span
                  className="ml-auto text-xs transition-transform duration-200"
                  style={{
                    color: CYAN,
                    transform: expanded === project.name ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}
                >
                  &gt;
                </span>
              </button>

              <AnimatePresence>
                {expanded === project.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-6 py-2 text-sm">
                      <div className="flex items-center gap-2 text-xs mb-1" style={{ color: CYAN }}>
                        $ cat projects/{project.name.toLowerCase().replace(/\s+/g, '-')}/README.md
                      </div>
                      <div className="ml-2">
                        <div className="flex gap-1">
                          <span style={{ color: GRAY }}>&gt;</span>
                          <span className="text-white/70 text-xs leading-relaxed">
                            {project.description}
                          </span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          <span style={{ color: GRAY }}>&gt;</span>
                          <span className="text-xs">
                            <span style={{ color: GREEN }}>tech:</span>{' '}
                            <span className="text-white/60">
                              {project.technologies.join(', ')}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeIn} className="border-t border-white/5 my-1" />

        {/* GitHub repos */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">git log --oneline ~/github/</span>
            <span className="text-xs" style={{ color: GREEN }}>
              (LIVE)
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          className="ml-2 flex-1 overflow-y-auto min-h-0 pr-2"
        >
          {repos.map((repo) => (
            <motion.a
              key={repo.name}
              variants={fadeIn}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-1 text-sm hover:bg-white/[0.02] transition-colors group"
            >
              <span className="text-xs text-white/30 w-[60px] shrink-0 font-mono">
                {shortHash()}
              </span>
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background: langColors[repo.language] ?? langColors.Unknown,
                }}
              />
              <span className="text-white group-hover:text-[#00d4ff] transition-colors truncate">
                {repo.name}
              </span>
              <span className="text-white/40 text-xs hidden sm:inline truncate flex-1 min-w-0">
                {repo.description?.length > 50
                  ? repo.description.slice(0, 50) + '...'
                  : repo.description}
              </span>
              {repo.stars > 0 && (
                <span className="text-xs shrink-0" style={{ color: '#fbbf24' }}>
                  {'*'.repeat(Math.min(repo.stars, 5))}
                </span>
              )}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
