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
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore my data analytics and AI-powered projects
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        
        {/* Stock Dashboard CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl animate-bounce-gentle">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  📈 Real-Time Stock Analytics
                </h2>
              </div>
              
              <p className="text-xl text-white/95 mb-8 max-w-3xl mx-auto font-semibold">
                Dive into live market data with colorful, interactive charts! 🎨 
                Powered by Elasticsearch, track trends and watch those stocks soar! 🚀
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <Activity className="w-8 h-8 text-cyan-300 mb-3 mx-auto" />
                  <h3 className="text-lg font-semibold text-white mb-2">OHLC Charts</h3>
                  <p className="text-sm text-white/80">Advanced candlestick visualizations with high/low/open/close data</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <BarChart3 className="w-8 h-8 text-purple-300 mb-3 mx-auto" />
                  <h3 className="text-lg font-semibold text-white mb-2">Volume Analysis</h3>
                  <p className="text-sm text-white/80">Deep dive into trading volumes and market activity</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <LineChart className="w-8 h-8 text-pink-300 mb-3 mx-auto" />
                  <h3 className="text-lg font-semibold text-white mb-2">Price Trends</h3>
                  <p className="text-sm text-white/80">Real-time price movements and historical comparisons</p>
                </div>
              </div>
              
              {/* CTA Button */}
              <Link href="/stocks">
                <button 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
                  data-testid="button-view-stock-dashboard"
                >
                  View Live Stock Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              
              <p className="mt-6 text-sm text-white/70">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Live data • Updates every 30 seconds
                </span>
              </p>
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
