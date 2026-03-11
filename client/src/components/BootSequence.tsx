import { useEffect } from "react";
import { motion, useAnimate, stagger } from "framer-motion";

const BOOT_LINES = [
  { status: "OK", text: "Loading neural_os v2.0...", color: "#00d4ff" },
  { status: "OK", text: "Initializing quantum processors...", color: "#00d4ff" },
  { status: "OK", text: "Mounting /dev/creativity...", color: "#00d4ff" },
  { status: "OK", text: "Loading skill modules (37 packages)...", color: "#00d4ff" },
  { status: "OK", text: "Connecting to GitHub API...", color: "#4ade80" },
  { status: "OK", text: "Fetching Dev.to articles...", color: "#4ade80" },
  { status: "OK", text: "Neural pathways established", color: "#4ade80" },
  { status: "OK", text: "System ready. Welcome, visitor.", color: "#4ade80" },
];

const STAGGER_DELAY = 0.15; // 150ms between lines
const POST_COMPLETE_DELAY = 400; // 400ms after last line before onComplete

export default function BootSequence({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const runSequence = async () => {
      await animate(
        ".boot-line",
        { opacity: 1, y: 0 },
        {
          duration: 0.15,
          delay: stagger(STAGGER_DELAY),
        }
      );

      // Wait 400ms after the last line, then signal completion
      setTimeout(onComplete, POST_COMPLETE_DELAY);
    };

    runSequence();
  }, [animate, onComplete]);

  return (
    <div
      ref={scope}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontSize: "0.875rem",
          lineHeight: 1.8,
          padding: "2rem",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        {BOOT_LINES.map((line, i) => (
          <motion.div
            key={i}
            className="boot-line"
            initial={{ opacity: 0, y: 6 }}
            style={{
              display: "flex",
              gap: "0.5rem",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#4ade80", fontWeight: 700 }}>
              [{line.status}]
            </span>
            <span style={{ color: line.color }}>{line.text}</span>
            {i === BOOT_LINES.length - 1 && (
              <motion.span
                style={{ color: "#00d4ff" }}
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                _
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
