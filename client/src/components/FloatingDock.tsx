import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'identity', label: 'Identity', icon: '01' },
  { id: 'projects', label: 'Projects', icon: '02' },
  { id: 'experience', label: 'Experience', icon: '03' },
  { id: 'skills', label: 'Skills', icon: '04' },
  { id: 'interface', label: 'Interface', icon: '05' },
];

interface FloatingDockProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function FloatingDock({
  activeTab,
  onTabChange,
}: FloatingDockProps) {
  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.5,
        type: 'spring',
        stiffness: 200,
        damping: 25,
      }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-strong flex gap-1 px-2 py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-4 py-2.5 rounded-xl text-sm transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-[#64748b] hover:text-[#94a3b8]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="dock-active"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(168,85,247,0.15))',
                    border: '1px solid rgba(0,212,255,0.2)',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <span className="font-mono text-xs opacity-50">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
