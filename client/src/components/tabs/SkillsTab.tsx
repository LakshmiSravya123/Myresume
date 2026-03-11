import { motion } from "framer-motion";
import { useState } from "react";

interface SkillCategory {
  title: string;
  skills: string[];
}

const categories: SkillCategory[] = [
  {
    title: "Languages",
    skills: ["Python", "R", "SQL", "C++", "JavaScript"],
  },
  {
    title: "AI & ML",
    skills: [
      "TensorFlow",
      "PyTorch",
      "scikit-learn",
      "LangChain",
      "RAG",
      "Llama 3.1",
      "FAISS",
      "Pinecone",
      "DistilBERT",
    ],
  },
  {
    title: "Data",
    skills: [
      "Pandas",
      "NumPy",
      "ETL",
      "Statistical Modeling",
      "Data Modeling",
      "Elasticsearch",
    ],
  },
  {
    title: "Visualization",
    skills: ["D3.js", "Plotly", "Tableau", "Power BI", "Streamlit", "Grafana"],
  },
  {
    title: "Infrastructure",
    skills: ["Docker", "Kubernetes", "Prometheus", "Vercel"],
  },
  {
    title: "Web",
    skills: [
      "React",
      "AngularJS",
      "Flask",
      "Spring Boot",
      "FastAPI",
      "Next.js",
    ],
  },
];

const totalSkills = categories.reduce(
  (acc, cat) => acc + cat.skills.length,
  0
);

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const panelVariant = {
  hidden: { opacity: 0, y: 25, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function SkillBadge({ skill }: { skill: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={
        isHovered
          ? {
              scale: 1.1,
              boxShadow: "0 0 12px rgba(6,182,212,0.4)",
            }
          : {
              scale: 1,
              boxShadow: "0 0 0px rgba(6,182,212,0)",
            }
      }
      transition={{ duration: 0.2 }}
      className="glass text-sm text-[#c4d0e0] px-3 py-1 rounded-full cursor-default select-none transition-colors duration-200 hover:text-cyan-300 hover:border-cyan-400/30"
    >
      {skill}
    </motion.span>
  );
}

function CategoryPanel({ category, index }: { category: SkillCategory; index: number }) {
  return (
    <motion.div
      variants={panelVariant}
      className="glass rounded-xl p-4 relative overflow-hidden group"
    >
      {/* Animated border effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: [
            "inset 0 0 0 1px rgba(6,182,212,0.15)",
            "inset 0 0 0 1px rgba(147,51,234,0.15)",
            "inset 0 0 0 1px rgba(6,182,212,0.15)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.5,
        }}
      />

      <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-cyan-400/80 mb-3">
        {category.title}
      </h3>

      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <SkillBadge key={skill} skill={skill} />
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillsTab() {
  return (
    <motion.div
      key="skills"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex flex-col items-center justify-center h-screen px-8 select-none"
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-5">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold gradient-text-cyan">
            Neural Layers
          </h2>
          <p className="font-mono text-xs text-cyan-400/50 mt-1">
            // skills.map()
          </p>
        </div>

        {/* Skills Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {categories.map((category, index) => (
            <CategoryPanel
              key={category.title}
              category={category}
              index={index}
            />
          ))}
        </motion.div>

        {/* Summary stat */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center text-[#475569] text-xs font-mono"
        >
          {totalSkills}+ technologies across {categories.length} domains
        </motion.p>
      </div>
    </motion.div>
  );
}
