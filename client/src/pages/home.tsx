import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import AboutSection from "@/components/AboutSection";
import AnalyticsSection from "@/components/AnalyticsSection";
import ElasticsearchSection from "@/components/ElasticsearchSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import AIQuestionnaire from "@/components/AIQuestionnaire";

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
    <div className="min-h-screen bg-white font-inter">
      <Navigation 
        onSectionClick={scrollToSection}
        onChatToggle={handleChatToggle}
      />
      
      <main>
        <AboutSection />
        <AIQuestionnaire />
        <AnalyticsSection />
        <ElasticsearchSection />
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
