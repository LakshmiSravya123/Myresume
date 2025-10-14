import { useState, useRef } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import AIQuestionnaire from "@/components/AIQuestionnaire";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, Activity, BarChart3, LineChart, Video } from "lucide-react";

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Account for fixed header height (64px for h-16) plus some extra padding
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
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        onSectionClick={scrollToSection}
        onChatToggle={handleChatToggle}
      />
      
      <main>
        <AboutSection />
        <AIQuestionnaire />
        
        {/* Featured Projects - Image Cards */}
        <section id="featured" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore my data analytics and AI-powered projects
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Real-Time Stock Analytics */}
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    Real-Time Stock Analytics
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Live stock market data with Elasticsearch-powered visualizations
                  </p>
                </div>
              </Link>

              {/* AI Video Generator */}
              <a
                href="https://video-ai-beryl.vercel.app/index_enhanced.html"
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer"
                data-testid="link-ai-video-generator"
              >
                <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <img
                    src={new URL('@assets/stock_images/professional_data_an_b3a24f87.jpg', import.meta.url).href}
                    alt="AI Video Generator"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center text-white">
                        <Video className="w-5 h-5 mr-2" />
                        <span className="font-semibold">View Project</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  AI Video Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  AI-powered video creation platform with advanced editing features
                </p>
              </a>

              {/* Grafana Dashboard */}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Grafana Analytics Dashboard
                </h3>
                <p className="text-gray-600 text-sm">
                  Real-time portfolio analytics and performance metrics visualization
                </p>
              </a>

              {/* Tesla Sales Dashboard */}
              <a
                href="https://tesla-sales-dashboard.vercel.app/videos.html"
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Tesla Sales Dashboard
                </h3>
                <p className="text-gray-600 text-sm">
                  Interactive sales analytics with comprehensive data visualizations
                </p>
              </a>
            </div>
          </div>
        </section>
        
        <ProjectsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Lakshmi Sravya Vedantham. Built with modern web technologies and AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
