import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail, ArrowDown, Map, Mouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonHover, buttonTap } from "@/lib/animations";
import professionalPhoto from "@assets/stock_images/professional_headsho_563743ba.jpg";

// Custom typing effect hook
function useTypingEffect(words: string[], typingSpeed = 80, deletingSpeed = 50, pauseDuration = 2000) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setText(currentWord.substring(0, isDeleting ? text.length - 1 : text.length + 1));
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return text;
}

// Animated counter hook
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return { count, ref };
}

export default function HeroSection() {
  const typedText = useTypingEffect(["Data Scientist", "ML Engineer", "AI Solutions Architect"]);
  const yearsExp = useCounter(3);
  const projects = useCounter(15);
  const technologies = useCounter(25);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative py-20 md:py-32 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] rounded-full bg-purple-400/20 dark:bg-purple-500/10 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [0.95, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-indigo-400/15 dark:bg-indigo-500/10 blur-3xl"
          animate={{ x: [0, 20, -20, 0], y: [0, -20, 0], scale: [1, 0.95, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Photo Section with animated ring */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-start"
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Rotating gradient ring */}
              <motion.div
                className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 blur-sm"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              {/* Outer glow */}
              <div className="absolute -inset-4 rounded-xl bg-blue-500/20 dark:bg-blue-400/10 blur-xl" />
              <img
                src={professionalPhoto}
                alt="Lakshmi Sravya Vedantham"
                className="relative w-64 h-64 rounded-xl object-cover shadow-xl"
              />
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-medium rounded-full mb-6"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Available for opportunities
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Lakshmi Sravya Vedantham
              </motion.span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-8"
            >
              {/* Typing effect */}
              <h2 className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 mb-6 h-8">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {typedText}
                </span>
                <motion.span
                  className="inline-block w-0.5 h-6 bg-blue-600 dark:bg-blue-400 ml-1 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                />
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg">
                Masters in AI from Northeastern University. Transforming complex data into actionable insights through machine learning and innovative AI solutions.
              </p>
            </motion.div>

            {/* Animated stat counters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-3 gap-6 mb-10"
            >
              <div ref={yearsExp.ref} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{yearsExp.count}+</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Years Experience</div>
              </div>
              <div ref={projects.ref} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">{projects.count}+</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Projects</div>
              </div>
              <div ref={technologies.ref} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">{technologies.count}+</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Technologies</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  onClick={() => scrollToSection('projects')}
                  data-testid="button-view-work"
                >
                  <Download className="h-5 w-5 mr-2" />
                  View My Projects
                </Button>
              </motion.div>
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-3 text-lg"
                  onClick={() => window.open('https://lakshmisravyavedantham.github.io/career-path/', '_blank')}
                  data-testid="button-career-journey"
                >
                  <Map className="h-5 w-5 mr-2" />
                  Career Journey
                </Button>
              </motion.div>
              <div className="flex items-center gap-4">
                <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600"
                    onClick={() => window.open('https://github.com/LakshmiSravyaVedantham/', '_blank')}
                    data-testid="hero-button-github"
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600"
                    onClick={() => window.open('https://www.linkedin.com/in/lakshmisravyavedantham', '_blank')}
                    data-testid="hero-button-linkedin"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600"
                    onClick={() => window.location.href = 'mailto:lakshmisravya.vedantham@gmail.com'}
                    data-testid="hero-button-email"
                  >
                    <Mail className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col items-center mt-8 cursor-pointer group"
          onClick={() => scrollToSection('about')}
        >
          <motion.div
            className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center pt-2 group-hover:border-blue-500 transition-colors"
          >
            <motion.div
              className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full group-hover:bg-blue-500"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 group-hover:text-blue-500 transition-colors">
            Scroll to explore
          </span>
        </motion.div>
      </div>
    </section>
  );
}
