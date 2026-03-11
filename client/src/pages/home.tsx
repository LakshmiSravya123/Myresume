import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import NeuralNetwork from "@/components/NeuralNetwork";
import CursorGlow from "@/components/CursorGlow";
import FloatingDock from "@/components/FloatingDock";
import IdentityTab from "@/components/tabs/IdentityTab";
import ProjectsTab from "@/components/tabs/ProjectsTab";
import ExperienceTab from "@/components/tabs/ExperienceTab";
import SkillsTab from "@/components/tabs/SkillsTab";
import InterfaceTab from "@/components/tabs/InterfaceTab";

export default function Home() {
  const [activeTab, setActiveTab] = useState("identity");

  return (
    <div className="h-screen w-screen overflow-hidden relative" style={{ background: "var(--neural-bg)" }}>
      <NeuralNetwork />
      <CursorGlow />

      <div className="relative z-10 h-full w-full">
        <AnimatePresence mode="wait">
          {activeTab === "identity" && <IdentityTab key="identity" />}
          {activeTab === "projects" && <ProjectsTab key="projects" />}
          {activeTab === "experience" && <ExperienceTab key="experience" />}
          {activeTab === "skills" && <SkillsTab key="skills" />}
          {activeTab === "interface" && <InterfaceTab key="interface" />}
        </AnimatePresence>
      </div>

      <FloatingDock activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
