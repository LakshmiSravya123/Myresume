import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Map, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonHover, buttonTap } from "@/lib/animations";
import professionalPhoto from "@assets/6F3E376A-FD9E-4A42-BAC0-69D9A66F2453_1_201_a_1758236938466.jpeg";

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

export default function AboutSection() {
  const typedText = useTypingEffect(["Data Scientist", "ML Engineer", "AI Solutions Architect"]);
  const yearsExp = useCounter(3);
  const projects = useCounter(15);
  const technologies = useCounter(25);

  return (
    <section id="about" className="relative pt-32 pb-24 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-blue-400/15 dark:bg-blue-500/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] rounded-full bg-purple-400/15 dark:bg-purple-500/10 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [0.95, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-indigo-400/10 dark:bg-indigo-500/8 blur-3xl"
          animate={{ x: [0, 20, -20, 0], y: [0, -20, 0], scale: [1, 0.95, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Profile Image with animated ring */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Rotating gradient ring */}
              <motion.div
                className="absolute -inset-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50 blur-sm"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute -inset-4 rounded-lg bg-blue-500/15 dark:bg-blue-400/10 blur-xl" />
              <img
                src={professionalPhoto}
                alt="Lakshmi Sravya Vedantham"
                className="relative w-full max-w-sm mx-auto rounded-lg object-cover shadow-xl aspect-square border border-gray-200 dark:border-gray-700"
                data-testid="about-profile-image"
              />
            </motion.div>
          </motion.div>

          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-medium rounded-full"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Available for opportunities
            </motion.div>

            {/* Name */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Lakshmi Sravya Vedantham
            </h2>

            {/* Typing effect role */}
            <div className="h-8">
              <span className="text-xl md:text-2xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {typedText}
              </span>
              <motion.span
                className="inline-block w-0.5 h-6 bg-blue-600 dark:bg-blue-400 ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              />
            </div>

            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Hey there! I'm a data scientist and AI enthusiast hooked on turning raw data into stories that inspire. With Python and machine learning, I create projects like apps and dashboards that make tech feel approachable and human.
              </p>

              <p>
                I'm all about building tech that connects and uplifts, from exploring AI ethics to crafting tools that spark joy. Thanks for stopping by—stay tuned for more of my journey with AI, spirit, and song!
              </p>
            </div>

            {/* Animated stat counters */}
            <div className="grid grid-cols-3 gap-6 py-4">
              <div ref={yearsExp.ref} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{yearsExp.count}+</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Years Exp</div>
              </div>
              <div ref={projects.ref} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">{projects.count}+</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Projects</div>
              </div>
              <div ref={technologies.ref} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">{technologies.count}+</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Technologies</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  onClick={() => window.open('https://lakshmisravyavedantham.github.io/career-path/', '_blank')}
                  data-testid="button-career-journey"
                >
                  <Map className="h-5 w-5 mr-2" />
                  Career Journey
                </Button>
              </motion.div>
              <div className="flex items-center gap-3">
                <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600"
                    onClick={() => window.open('https://github.com/LakshmiSravyaVedantham/', '_blank')}
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
                  >
                    <Mail className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col items-center mt-16 cursor-pointer group"
          onClick={() => {
            const el = document.getElementById('ai-questionnaire');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <motion.div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center pt-2 group-hover:border-blue-500 transition-colors">
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
