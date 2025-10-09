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
        
        {/* Project Showcase Buttons */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
              Featured Projects
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-6 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all min-w-[280px]"
                onClick={() => window.open('https://video-ai-beryl.vercel.app/index_enhanced.html', '_blank')}
                data-testid="button-ai-video-generator"
              >
                <Video className="h-6 w-6 mr-3" />
                AI Video Generator
              </Button>
              
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all min-w-[280px]"
                onClick={() => window.open('https://lakshmisravyavedantham.grafana.net/goto/cezvqn2s8464gd?orgId=1', '_blank')}
                data-testid="button-grafana-dashboard"
              >
                <BarChart3 className="h-6 w-6 mr-3" />
                Grafana Dashboard
              </Button>
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
