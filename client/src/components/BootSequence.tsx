import { useEffect, useMemo } from 'react';
import { motion, useAnimate, stagger } from 'framer-motion';

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Late night exploring? Respect.';
  if (h < 12) return 'Good morning, visitor.';
  if (h < 17) return 'Good afternoon, visitor.';
  if (h < 21) return 'Good evening, visitor.';
  return 'Burning the midnight oil? Same.';
}

function detectEnvironment(): string {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return `Detected: ${browser} on ${os}`;
}

const STAGGER_DELAY = 0.15;
const POST_COMPLETE_DELAY = 400;

export default function BootSequence({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [scope, animate] = useAnimate();

  const bootLines = useMemo(() => [
    { status: 'OK', text: 'Loading neural_os v2.0...', color: '#00d4ff' },
    { status: 'OK', text: detectEnvironment(), color: '#00d4ff' },
    { status: 'OK', text: 'Initializing neural processors...', color: '#00d4ff' },
    { status: 'OK', text: 'Mounting /dev/creativity...', color: '#00d4ff' },
    { status: 'OK', text: 'Loading AI modules (37 packages)...', color: '#00d4ff' },
    { status: 'OK', text: 'Connecting to GitHub API...', color: '#4ade80' },
    { status: 'OK', text: 'Spawning autonomous agents...', color: '#4ade80' },
    { status: 'OK', text: 'Neural pathways established', color: '#4ade80' },
    { status: 'OK', text: `System ready. ${getTimeGreeting()}`, color: '#4ade80' },
  ], []);

  useEffect(() => {
    const runSequence = async () => {
      await animate(
        '.boot-line',
        { opacity: 1, y: 0 },
        {
          duration: 0.15,
          delay: stagger(STAGGER_DELAY),
        }
      );
      setTimeout(onComplete, POST_COMPLETE_DELAY);
    };
    runSequence();
  }, [animate, onComplete]);

  return (
    <div
      ref={scope}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontSize: '0.875rem',
          lineHeight: 1.8,
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        {bootLines.map((line, i) => (
          <motion.div
            key={i}
            className="boot-line"
            initial={{ opacity: 0, y: 6 }}
            style={{
              display: 'flex',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: '#4ade80', fontWeight: 700 }}>
              [{line.status}]
            </span>
            <span style={{ color: line.color }}>{line.text}</span>
            {i === bootLines.length - 1 && (
              <motion.span
                style={{ color: '#00d4ff' }}
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: 'reverse',
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
