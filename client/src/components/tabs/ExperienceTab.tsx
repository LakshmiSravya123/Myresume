import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import GlassPanel from "@/components/GlassPanel";

interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string[];
  technologies: string[];
}

interface Education {
  institution: string;
  degree: string;
  year: string;
}

interface ResumeData {
  workExperience: WorkExperience[];
  education: Education[];
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

function timelineCardVariant(side: "left" | "right") {
  return {
    hidden: { opacity: 0, x: side === "left" ? -40 : 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
}

export default function ExperienceTab() {
  const { data: portfolioData } = useQuery<ResumeData>({
    queryKey: ["portfolio"],
    queryFn: async () => { const res = await apiRequest("GET", "/api/portfolio"); return res.json(); },
  });

  const experiences = portfolioData?.workExperience?.slice(0, 3) ?? [];
  const education = portfolioData?.education?.[0];

  return (
    <motion.div
      key="experience"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex flex-col items-center justify-center h-screen px-8 select-none"
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-3">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold gradient-text-cyan">
            Experience
          </h2>
          <p className="font-mono text-xs text-cyan-400/50 mt-1">
            // career.timeline
          </p>
        </div>

        {/* Timeline */}
        <div className="relative flex-1">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-cyan-400/60 via-purple-400/40 to-transparent">
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-purple-400 to-transparent"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3"
          >
            {experiences.map((exp, index) => {
              const side = index % 2 === 0 ? "left" : "right";
              const isLeft = side === "left";

              return (
                <motion.div
                  key={`${exp.company}-${index}`}
                  variants={timelineCardVariant(side)}
                  className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3"
                >
                  {/* Left card or spacer */}
                  {isLeft ? (
                    <div className="flex justify-end">
                      <TimelineCard experience={exp} />
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Center dot */}
                  <div className="relative z-10 flex items-center justify-center">
                    <motion.div
                      className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#0a0a1a]"
                      animate={{
                        boxShadow: [
                          "0 0 6px rgba(6,182,212,0.4)",
                          "0 0 14px rgba(6,182,212,0.7)",
                          "0 0 6px rgba(6,182,212,0.4)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3,
                      }}
                    />
                  </div>

                  {/* Right card or spacer */}
                  {!isLeft ? (
                    <div className="flex justify-start">
                      <TimelineCard experience={exp} />
                    </div>
                  ) : (
                    <div />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Education */}
        {education && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex justify-center mt-2"
          >
            <GlassPanel className="px-6 py-3 max-w-md text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="w-4 h-4 text-cyan-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                  />
                </svg>
                <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/70">
                  Education
                </span>
              </div>
              <p className="text-white font-semibold text-sm">
                {education.institution}
              </p>
              <p className="text-[#94a3b8] text-xs mt-0.5">
                {education.degree} | {education.year}
              </p>
              <p className="font-mono text-[10px] text-cyan-400/60 mt-1">
                GPA 3.8
              </p>
            </GlassPanel>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function TimelineCard({ experience }: { experience: WorkExperience }) {
  const bulletPoints = experience.description.slice(0, 2);

  return (
    <GlassPanel className="p-4 max-w-sm w-full">
      <h3 className="text-white font-bold text-sm leading-tight">
        {experience.company}
      </h3>
      <p className="gradient-text-cyan text-xs font-medium mt-0.5">
        {experience.position}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <span className="font-mono text-[10px] text-[#64748b]">
          {experience.duration}
        </span>
        <span className="text-[#334155]">|</span>
        <span className="font-mono text-[10px] text-[#64748b]">
          {experience.location}
        </span>
      </div>

      <ul className="mt-2 space-y-1">
        {bulletPoints.map((point, i) => (
          <li
            key={i}
            className="text-[11px] text-[#94a3b8] leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-cyan-400/50 line-clamp-2"
          >
            {point}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1 mt-2">
        {experience.technologies.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="glass text-[9px] font-mono text-cyan-300/60 px-1.5 py-0.5 rounded"
          >
            {tech}
          </span>
        ))}
      </div>
    </GlassPanel>
  );
}
