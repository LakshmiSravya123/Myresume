import { motion } from 'framer-motion';

const CYAN = '#00d4ff';
const GRAY = '#6b7280';
const GREEN = '#4ade80';
const PURPLE = '#a855f7';
const YELLOW = '#fbbf24';

const tags = ['Bhajans', 'Moral Stories', 'Indian Values', 'Kids Education', 'Fun Learning'];

const researchLines = [
  'Exploring AI-powered video generation pipelines',
  'Building tools for automated content creation',
  'Multimodal AI \u2014 text, audio, visual',
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

export default function StudioTab() {
  return (
    <motion.div
      key="studio"
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
        {/* README intro */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">cat ~/studio/README.md</span>
          </div>
          <div className="ml-4 mt-2 text-sm text-white/70 leading-relaxed">
            Where AI meets creativity. From generating videos to teaching kids
            &mdash; building things that matter.
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeIn} className="border-t border-white/5 my-1" />

        {/* dumdumhum YouTube channel */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">ls ~/studio/dumdumhum/</span>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="ml-4">
          <div className="flex items-center gap-3">
            <a
              href="https://www.youtube.com/@dumdumhum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold transition-colors duration-200 hover:text-[#00d4ff]"
              style={{ color: PURPLE }}
            >
              dumdumhum
            </a>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{ color: YELLOW, border: `1px solid ${YELLOW}40` }}
            >
              YouTube
            </span>
          </div>

          <div className="mt-2 text-sm text-white/60 leading-relaxed">
            <span style={{ color: GRAY }}>&gt;</span>{' '}
            A YouTube channel crafted for kids &mdash; bhajans, moral stories,
            Indian values, and fun learning. Because the best lessons start early.
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  color: GREEN,
                  background: `${GREEN}10`,
                  border: `1px solid ${GREEN}25`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href="https://www.youtube.com/@dumdumhum"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs transition-colors duration-200 hover:text-[#00d4ff]"
            style={{ color: CYAN }}
          >
            <span style={{ color: GRAY }}>&gt;</span>{' '}
            youtube.com/@dumdumhum
          </a>
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeIn} className="border-t border-white/5 my-1" />

        {/* Video generation research */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">status ~/studio/videogen/</span>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="ml-4">
          <div className="flex flex-col gap-1.5">
            {researchLines.map((line) => (
              <div key={line} className="flex items-start gap-2 text-sm">
                <span style={{ color: GRAY }}>&gt;</span>
                <span className="text-white/60">{line}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: YELLOW }}
            />
            <span className="text-xs font-bold tracking-wider" style={{ color: YELLOW }}>
              IN PROGRESS
            </span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
