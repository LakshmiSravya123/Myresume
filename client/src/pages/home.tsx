import { useState, useRef } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import AIQuestionnaire from "@/components/AIQuestionnaire";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, Activity, BarChart3, LineChart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, buttonHover, buttonTap } from "@/lib/animations";

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleChatToggle = () => {
    scrollToSection('ai-questionnaire');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation
        onSectionClick={scrollToSection}
        onChatToggle={handleChatToggle}
      />

      <main>
        <AboutSection />
        <AIQuestionnaire />

        {/* Featured Projects - Image Cards */}
        <section id="featured" className="py-24 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore my data analytics and AI-powered projects
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {/* Real-Time Stock Analytics */}
              <motion.div variants={staggerItem}>
                <Link href="/stocks">
                  <div className="group cursor-pointer" data-testid="link-stock-analytics">
                    <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                      <img
                        src={new URL('@assets/stock_images/real-time_stock_mark_d9ff0cf8.jpg', import.meta.url).href}
                        alt="Real-Time Stock Analytics"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center text-white">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            <span className="font-semibold">View Analytics</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Real-Time Stock Analytics
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Live stock market data with Elasticsearch-powered visualizations
                    </p>
                  </div>
                </Link>
              </motion.div>

              {/* Dream Weaver */}
              <motion.div variants={staggerItem}>
                <a
                  href="https://dream-analysis-git-main-sravyas-projects-f5209810.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group cursor-pointer"
                  data-testid="link-dream-weaver"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <img
                      src={new URL('@assets/stock_images/professional_data_an_b3a24f87.jpg', import.meta.url).href}
                      alt="Dream Weaver"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center text-white">
                          <Sparkles className="w-5 h-5 mr-2" />
                          <span className="font-semibold">View Project</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Dream Weaver
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Creative AI-powered dream interpretation and visualization platform
                  </p>
                </a>
              </motion.div>

              {/* Grafana Dashboard */}
              <motion.div variants={staggerItem}>
                <a
                  href="https://lakshmisravyavedantham.grafana.net/goto/cezvqn2s8464gd?orgId=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group cursor-pointer"
                  data-testid="link-grafana-dashboard"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <img
                      src={new URL('@assets/stock_images/professional_data_an_ad29825c.jpg', import.meta.url).href}
                      alt="Grafana Dashboard"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center text-white">
                          <BarChart3 className="w-5 h-5 mr-2" />
                          <span className="font-semibold">View Dashboard</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Grafana Analytics Dashboard
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Real-time portfolio analytics and performance metrics visualization
                  </p>
                </a>
              </motion.div>

              {/* Tesla Sales Dashboard */}
              <motion.div variants={staggerItem}>
                <a
                  href="https://tesla-sales-dashboard.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group cursor-pointer"
                  data-testid="link-tesla-dashboard"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <img
                      src={new URL('@assets/stock_images/professional_data_an_8667f73c.jpg', import.meta.url).href}
                      alt="Tesla Sales Dashboard"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center text-white">
                          <TrendingUp className="w-5 h-5 mr-2" />
                          <span className="font-semibold">View Dashboard</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Tesla Sales Dashboard
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Interactive sales analytics with comprehensive data visualizations
                  </p>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <ProjectsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 Lakshmi Sravya Vedantham. Built with modern web technologies and AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
