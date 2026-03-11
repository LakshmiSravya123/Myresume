import { motion } from 'framer-motion';

const CYAN = '#00d4ff';
const GREEN = '#4ade80';
const GRAY = '#6b7280';

const ASCII_ART = [
  '    .--.',
  '   /    \\',
  '  | o  o |',
  '  |  __  |',
  '   \\    /',
  '    `--\'',
  '   /|  |\\',
  '  / |  | \\',
];

const skillRows: { label: string; value: string }[] = [
  { label: 'Languages', value: 'Python, R, SQL, C++, JavaScript' },
  { label: 'AI & ML', value: 'TensorFlow, PyTorch, scikit-learn, LangChain, RAG, FAISS' },
  { label: 'Data', value: 'Pandas, NumPy, ETL, Elasticsearch, Statistical Modeling' },
  { label: 'Viz', value: 'D3.js, Plotly, Tableau, Power BI, Streamlit, Grafana' },
  { label: 'Infra', value: 'Docker, Kubernetes, Prometheus, Vercel' },
  { label: 'Web', value: 'React, Flask, Spring Boot, FastAPI, Next.js' },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function SkillsTab() {
  return (
    <motion.div
      key="skills"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="h-full flex flex-col justify-center font-mono select-none overflow-hidden"
    >
      {/* Command header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 text-sm mb-6"
      >
        <span style={{ color: CYAN }}>$</span>
        <span className="text-white">neofetch --skills</span>
      </motion.div>

      {/* Neofetch layout: ASCII art + info */}
      <div className="flex gap-8 items-start">
        {/* ASCII art (left) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden md:block shrink-0"
        >
          <pre className="text-sm leading-snug" style={{ color: CYAN }}>
            {ASCII_ART.join('\n')}
          </pre>
        </motion.div>

        {/* Info (right) */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-0"
        >
          {/* Header */}
          <motion.div variants={fadeIn} className="mb-1">
            <span style={{ color: CYAN }}>sravya</span>
            <span style={{ color: GRAY }}>@</span>
            <span style={{ color: CYAN }}>neural-os</span>
          </motion.div>

          <motion.div variants={fadeIn} className="mb-3">
            <span style={{ color: GRAY }}>
              {'\u2500'.repeat(17)}
            </span>
          </motion.div>

          {/* Skill rows */}
          {skillRows.map((row) => (
            <motion.div
              key={row.label}
              variants={fadeIn}
              className="flex text-sm py-0.5"
            >
              <span
                className="w-[100px] shrink-0 text-right pr-4"
                style={{ color: CYAN }}
              >
                {row.label}
              </span>
              <span className="text-white/80">{row.value}</span>
            </motion.div>
          ))}

          {/* Blank line */}
          <motion.div variants={fadeIn} className="h-4" />

          {/* Bottom stats */}
          <motion.div variants={fadeIn} className="flex text-sm py-0.5">
            <span
              className="w-[100px] shrink-0 text-right pr-4"
              style={{ color: CYAN }}
            >
              Packages
            </span>
            <span style={{ color: GREEN }}>37</span>
          </motion.div>

          <motion.div variants={fadeIn} className="flex text-sm py-0.5">
            <span
              className="w-[100px] shrink-0 text-right pr-4"
              style={{ color: CYAN }}
            >
              Uptime
            </span>
            <span style={{ color: GREEN }}>8 years</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
