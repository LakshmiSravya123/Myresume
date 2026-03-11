import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/* ─── TextGenerate ─────────────────────────────────────── */

interface TextGenerateProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function TextGenerate({
  text,
  className = '',
  delay = 0,
  duration = 0.05,
}: TextGenerateProps) {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{
            delay: delay + index * duration,
            duration: 0.3,
            ease: 'easeOut',
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── TypeWriter ───────────────────────────────────────── */

interface TypeWriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export function TypeWriter({
  text,
  className = '',
  speed = 50,
  delay = 0,
}: TypeWriterProps) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setIsDone(false);

    const startTimeout = setTimeout(() => {
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayed(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsDone(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayed}
      {!isDone && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="inline-block ml-0.5"
          style={{
            width: 2,
            height: '1em',
            backgroundColor: 'var(--neural-cyan)',
            verticalAlign: 'text-bottom',
          }}
        />
      )}
    </span>
  );
}

/* ─── ScrambleText ─────────────────────────────────────── */

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

export function ScrambleText({
  text,
  className = '',
  delay = 0,
}: ScrambleTextProps) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    const totalFrames = text.length * 3;
    let currentFrame = 0;

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentFrame >= totalFrames) {
          setDisplayed(text);
          clearInterval(interval);
          return;
        }

        const revealThreshold = currentFrame / 3;
        let result = '';

        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') {
            result += ' ';
          } else if (i < revealThreshold) {
            result += text[i];
          } else {
            result += CHARSET[Math.floor(Math.random() * CHARSET.length)];
          }
        }

        setDisplayed(result);
        currentFrame++;
      }, 30);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  return <span className={className}>{displayed}</span>;
}
