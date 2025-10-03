import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail, ArrowDown, Sparkles, Database, Brain, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import professionalPhoto from "@assets/stock_images/professional_headsho_563743ba.jpg";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="py-20 md:py-32 bg-white">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
                className="w-64 h-64 rounded-xl object-cover shadow-xl"
              />
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
              className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full mb-6"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Available for opportunities
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
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
              <h2 className="text-xl md:text-2xl font-medium text-gray-600 mb-6">Data Scientist & AI Engineer</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                Masters in AI from Northeastern University. Transforming complex data into actionable insights through machine learning and innovative AI solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col gap-4 mb-12"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  onClick={() => scrollToSection('projects')}
                  data-testid="button-view-work"
                >
                  <Download className="h-5 w-5 mr-2" />
                  View My Projects
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => window.open('https://video-ai-beryl.vercel.app/index_enhanced.html', '_blank')}
                  data-testid="button-video-generator"
                >
                  <Video className="h-5 w-5 mr-2" />
                  AI Video Generator
                </Button>
              </div>
              <div className="flex items-center gap-4 justify-center sm:justify-start">
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
                  onClick={() => window.open('https://www.linkedin.com/in/lakshmisravyavedantham', '_blank')}
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