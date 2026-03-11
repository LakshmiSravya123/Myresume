import { motion } from "framer-motion";
import { TypeWriter, ScrambleText, TextGenerate } from "@/components/TextEffects";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const floatAnimation = {
  y: [0, -8, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
};

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/LakshmiSravyaVedantham",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/sravya-vedantham",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:lakshmisravya.vedantham@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const stats = [
  { label: "Years Experience", value: "10+" },
  { label: "Technologies", value: "30+" },
  { label: "Location", value: "San Jose, CA" },
];

export default function IdentityTab() {
  return (
    <motion.div
      key="identity"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.8 }}
      className="relative z-10 flex flex-col items-center justify-center h-screen px-6 select-none"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-4 text-center"
      >
        {/* Terminal init text */}
        <motion.div variants={fadeSlideUp} className="mb-2">
          <span className="font-mono text-xs text-cyan-400/70">
            <TypeWriter text="> neural_interface.init()" delay={0} speed={40} />
          </span>
        </motion.div>

        {/* Name — hero text */}
        <motion.div variants={fadeSlideUp}>
          <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tight gradient-text text-glow-cyan leading-none">
            SRAVYA
            <br />
            VEDANTHAM
          </h1>
        </motion.div>

        {/* Title with scramble effect */}
        <motion.div variants={fadeSlideUp} className="mt-2">
          <span className="text-xl text-[#94a3b8] tracking-wide">
            <ScrambleText text="AI & Data Science Engineer" delay={1500} />
          </span>
        </motion.div>

        {/* Tagline with text generate */}
        <motion.div variants={fadeSlideUp} className="max-w-lg mt-1">
          <span className="text-[#64748b] text-base">
            <TextGenerate
              text="Transforming complex data into intelligent systems"
              delay={2000}
            />
          </span>
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={fadeSlideUp}
          className="flex items-center gap-3 mt-6"
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="glass flex items-center gap-2 px-4 py-2 rounded-full text-[#94a3b8] text-sm font-mono transition-all duration-300 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:border-cyan-400/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {link.icon}
              <span className="hidden sm:inline">{link.label}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={fadeSlideUp}
          className="flex items-center gap-4 mt-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3 + i * 0.15, duration: 0.5 }}
              className="glass px-4 py-2 rounded-lg text-center"
            >
              <div className="font-mono text-sm font-bold text-cyan-400">
                {stat.value}
              </div>
              <div className="text-[10px] text-[#64748b] uppercase tracking-wider mt-0.5">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom navigation hint */}
        <motion.div
          className="mt-8 text-[#475569] text-xs tracking-wide"
          animate={floatAnimation}
        >
          navigate below
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
