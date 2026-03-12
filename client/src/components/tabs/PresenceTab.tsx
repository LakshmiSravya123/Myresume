import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const CYAN = '#00d4ff';
const GRAY = '#6b7280';
const GREEN = '#4ade80';

interface DevToArticle {
  id: number;
  title: string;
  url: string;
  published_at: string;
}

interface GitHubProject {
  name: string;
  description: string;
  language: string;
  url: string;
}

const profileLinks = [
  {
    label: 'dev.to/lakshmisravyavedantham',
    href: 'https://dev.to/lakshmisravyavedantham',
  },
  {
    label: 'github.com/LakshmiSravyaVedantham',
    href: 'https://github.com/LakshmiSravyaVedantham',
  },
  {
    label: 'linkedin.com/in/lakshmisravyavedantham',
    href: 'https://www.linkedin.com/in/lakshmisravyavedantham',
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '...' : str;
}

export default function PresenceTab() {
  const { data: articles, isLoading: articlesLoading } = useQuery<DevToArticle[]>({
    queryKey: ['devto-articles'],
    queryFn: async () => {
      const res = await fetch(
        'https://dev.to/api/articles?username=lakshmisravyavedantham&per_page=6'
      );
      if (!res.ok) throw new Error('Failed to fetch Dev.to articles');
      return res.json();
    },
  });

  const { data: githubProjects } = useQuery<GitHubProject[]>({
    queryKey: ['/api/github/projects'],
  });

  const repos = githubProjects ?? [];
  const posts = articles ?? [];

  return (
    <motion.div
      key="presence"
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
        {/* Dev.to header */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">
              curl dev.to/api/articles?username=lakshmisravyavedantham
            </span>
          </div>
        </motion.div>

        {/* Articles list */}
        <motion.div variants={fadeIn} className="ml-2">
          {articlesLoading ? (
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs"
              style={{ color: GRAY }}
            >
              fetching...
            </motion.div>
          ) : (
            <div className="flex flex-col gap-1">
              {posts.map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs py-0.5 hover:bg-white/[0.02] transition-colors group flex items-center gap-2"
                >
                  <span style={{ color: GRAY }}>&gt;</span>
                  <span className="text-white/70 group-hover:text-[#00d4ff] transition-colors truncate">
                    {truncate(article.title, 65)}
                  </span>
                </a>
              ))}
            </div>
          )}
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeIn} className="border-t border-white/5 my-1" />

        {/* GitHub stats */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">gh api user/repos --json stats</span>
          </div>
          <div className="ml-4 mt-2 flex gap-6 text-sm">
            <div>
              <span style={{ color: GRAY }}>Repos: </span>
              <span style={{ color: GREEN }}>{repos.length}</span>
            </div>
            <div>
              <span style={{ color: GRAY }}>Primary: </span>
              <span style={{ color: GREEN }}>Python</span>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeIn} className="border-t border-white/5 my-1" />

        {/* Profile links */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">open links/</span>
          </div>
          <div className="ml-4 mt-2 flex flex-col gap-1">
            {profileLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors duration-200 hover:text-[#00d4ff] hover:text-glow-cyan"
                style={{ color: '#94a3b8' }}
              >
                <span style={{ color: GRAY }}>&gt; </span>
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
