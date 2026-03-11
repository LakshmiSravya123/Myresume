import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import type { ResumeData } from '@shared/schema';

const CYAN = '#00d4ff';
const GRAY = '#6b7280';
const GREEN = '#4ade80';
const PURPLE = '#a855f7';

function fakeHash(): string {
  return Math.random().toString(16).slice(2, 9);
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ExperienceTab() {
  const { data: portfolio } = useQuery<ResumeData>({
    queryKey: ['/api/portfolio'],
  });

  const jobs = portfolio?.workExperience ?? [];
  const education = portfolio?.education ?? [];

  return (
    <motion.div
      key="experience"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="h-full flex flex-col font-mono select-none overflow-hidden"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3 h-full"
      >
        {/* Header */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: CYAN }}>$</span>
            <span className="text-white">git log --format=detailed career.log</span>
          </div>
        </motion.div>

        {/* Jobs */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-2 flex flex-col gap-4">
          {jobs.map((job, index) => {
            const isCurrentRole = index === 0 && job.duration.includes('Present');
            const bullets = isCurrentRole
              ? job.description.slice(0, 4)
              : job.description.slice(0, 2);
            const hash = fakeHash();

            return (
              <motion.div
                key={job.company}
                variants={fadeIn}
                className="ml-2"
                style={
                  isCurrentRole
                    ? {
                        borderLeft: `2px solid ${CYAN}33`,
                        paddingLeft: '0.75rem',
                      }
                    : undefined
                }
              >
                {/* Current role badge */}
                {isCurrentRole && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ background: GREEN }}
                    />
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: GREEN }}
                    >
                      HEAD — Current
                    </span>
                  </div>
                )}

                {/* Commit header */}
                <div className="text-sm">
                  <span className="text-yellow-500/80">commit {hash}</span>
                  {isCurrentRole && (
                    <span
                      className="ml-2 text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        color: CYAN,
                        border: `1px solid ${CYAN}33`,
                        background: `${CYAN}0a`,
                      }}
                    >
                      latest
                    </span>
                  )}
                </div>

                {/* Company line */}
                <div className="text-sm mt-0.5">
                  <span style={{ color: GRAY }}>Author:</span>{' '}
                  <span style={{ color: isCurrentRole ? CYAN : CYAN }}>
                    {job.company}
                  </span>{' '}
                  <span style={{ color: GRAY }}>({job.duration})</span>
                </div>

                {/* Role */}
                <div className="text-sm">
                  <span style={{ color: GRAY }}>Role:</span>{' '}
                  <span
                    className="text-white"
                    style={isCurrentRole ? { color: PURPLE, fontWeight: 600 } : undefined}
                  >
                    {job.position}
                  </span>
                  {job.location && (
                    <span style={{ color: GRAY }}> | {job.location}</span>
                  )}
                </div>

                {/* Bullet points */}
                <div className="ml-4 mt-1.5 flex flex-col gap-0.5">
                  {bullets.map((bullet, bi) => (
                    <div
                      key={bi}
                      className="text-xs leading-relaxed"
                      style={{ color: isCurrentRole ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.6)' }}
                    >
                      {bullet.length > 140 ? bullet.slice(0, 140) + '...' : bullet}
                    </div>
                  ))}
                </div>

                {/* Technologies */}
                {job.technologies && job.technologies.length > 0 && (
                  <div className="ml-4 mt-1.5 flex flex-wrap gap-1">
                    {isCurrentRole ? (
                      job.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{
                            color: tech.includes('Agentic') || tech.includes('Multi-Agent')
                              ? CYAN
                              : tech.includes('Video')
                              ? PURPLE
                              : 'rgba(255,255,255,0.5)',
                            border: `1px solid rgba(255,255,255,0.06)`,
                            background: 'rgba(255,255,255,0.02)',
                          }}
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <div className="text-xs">
                        <span style={{ color: GREEN }}>tech:</span>{' '}
                        <span className="text-white/50">
                          {job.technologies.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Separator line between jobs */}
                {index < jobs.length - 1 && (
                  <div className="mt-3 border-t border-white/5" />
                )}
              </motion.div>
            );
          })}

          {/* Education */}
          {education.length > 0 && (
            <motion.div variants={fadeIn} className="mt-2">
              <div className="border-t border-white/5 pt-3" />
              <div className="flex items-center gap-2 text-sm">
                <span style={{ color: CYAN }}>$</span>
                <span className="text-white">cat education.log</span>
              </div>
              <div className="ml-4 mt-1.5 flex flex-col gap-1">
                {education.map((edu) => (
                  <div key={edu.institution} className="text-sm">
                    <span style={{ color: GRAY }}>&gt;</span>{' '}
                    <span style={{ color: CYAN }}>{edu.institution}</span>
                    <span className="text-white/70">
                      {' '}&mdash; {edu.degree}
                    </span>
                    <span style={{ color: GRAY }}> &mdash; {edu.year}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
