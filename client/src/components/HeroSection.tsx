import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail, ArrowDown, Sparkles, Database, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import professionalPhoto from "@assets/stock_images/professional_headsho_563743ba.jpg";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <motion.div
        className="absolute top-20 left-20 text-blue-400"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Database className="h-8 w-8" />
      </motion.div>
      <motion.div
        className="absolute top-40 right-32 text-purple-400"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      >
        <Brain className="h-6 w-6" />
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-32 text-pink-400"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
      >
        <Sparkles className="h-7 w-7" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Photo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              <img
                src={professionalPhoto}
                alt="Lakshmi Sravya Vedantham"
                className="w-80 h-80 rounded-2xl object-cover shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
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
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-6"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Available for opportunities
            </motion.div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Lakshmi Sravya Vedantham
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed"
            >
              Welcome to my world, where code meets soul, and data dances with nature! I'm a data scientist and AI enthusiast with a passion for turning patterns into insights, blending technology with spirituality and creativity.
              <br /><br />
              Skilled in Python, machine learning, and AI tools like Retrieval-Augmented Generation (RAG), I build innovative solutions like EEG-based brain-computer interfaces (BCI) to explore moods and dreams. My work aims to harmonize tech with the human experience, shared through GitHub, Hugging Face, or no-code platforms like Glide.
              <br /><br />
              Spirituality shapes my life. Meditation grounds me, fueling clarity in my projects. My love for plants—my thriving indoor jungle—mirrors my approach to nurturing data into insights. Singing, from mantras to melodies, is my soul's expression, infusing my work with authenticity.
              <br /><br />
              I'm driven to create meaningful technology, from AI chatbots to intuitive dashboards, that inspires and connects. When not coding or meditating, I'm exploring AI ethics, MLOps, or singing to my plants, envisioning a future where innovation and human connection thrive.
              <br /><br />
              Thanks for stopping by! I'm excited to share my journey of data, spirit, and growth. Stay tuned for more!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                onClick={() => scrollToSection('experience')}
                data-testid="button-view-work"
              >
                <Download className="h-5 w-5 mr-2" />
                View My Work
              </Button>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-gray-100"
                  onClick={() => window.open('https://github.com/LakshmiSravya123/', '_blank')}
                  data-testid="hero-button-github"
                >
                  <Github className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-gray-100"
                  onClick={() => window.open('https://www.linkedin.com/in/lakshmi-sravya-vedantham-592ba977/', '_blank')}
                  data-testid="hero-button-linkedin"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-gray-100"
                  onClick={() => window.location.href = 'mailto:lakshmisravya.vedantham@gmail.com'}
                  data-testid="hero-button-email"
                >
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}