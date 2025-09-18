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
    <section id="hero" className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">

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

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
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
              <h2 className="text-xl font-medium text-gray-900 mb-4">Data Scientist & AI Engineer</h2>
              <p className="text-base text-gray-600 mb-6 leading-relaxed">
                Masters in AI from Northeastern University with a passion for transforming complex data into actionable insights. 
                Specialized in machine learning, AI automation, and innovative solutions that bridge technology with real-world impact.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium text-gray-900 mr-2">Education:</span>
                  Masters in AI • Northeastern University • 2020-2022
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium text-gray-900 mr-2">Specialties:</span>
                  Python, Machine Learning, RAG, EEG-BCI, Data Analytics
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                onClick={() => scrollToSection('projects')}
                data-testid="button-view-work"
              >
                <Download className="h-5 w-5 mr-2" />
                View My Projects
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