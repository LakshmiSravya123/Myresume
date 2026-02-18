import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Github, ExternalLink, Star, Clock, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { staggerContainer, staggerItem, buttonHover, buttonTap } from "@/lib/animations";

interface GitHubProject {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks?: number;
  url: string;
  updated_at: string;
  created_at?: string;
  topics?: string[];
}

// Language gradient map for header bars
const languageGradients: Record<string, string> = {
  Python: "from-green-400 to-blue-500",
  TypeScript: "from-blue-400 to-blue-600",
  JavaScript: "from-yellow-400 to-orange-500",
  Java: "from-red-400 to-red-600",
  HTML: "from-red-500 to-orange-400",
  CSS: "from-blue-500 to-purple-500",
  Swift: "from-orange-400 to-orange-600",
  Kotlin: "from-purple-400 to-purple-600",
  "C++": "from-blue-500 to-blue-700",
};

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 8;
    const rotateY = (x / rect.width) * 8;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => setTransform("");

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: transform ? "none" : "transform 0.4s ease" }}
      className={className}
    >
      {children}
    </div>
  );
}

export default function ProjectsSection() {
  const { data: githubProjects, isLoading } = useQuery<GitHubProject[]>({
    queryKey: ["/api/github/projects"],
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60_000,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      'JavaScript': 'bg-yellow-400 text-yellow-900',
      'TypeScript': 'bg-blue-400 text-blue-900',
      'Python': 'bg-green-400 text-green-900',
      'Java': 'bg-red-400 text-red-900',
      'Swift': 'bg-orange-400 text-orange-900',
      'Kotlin': 'bg-purple-400 text-purple-900',
      'C++': 'bg-blue-500 text-blue-50',
      'HTML': 'bg-red-500 text-red-50',
      'CSS': 'bg-blue-600 text-blue-50'
    };
    return colors[language] || 'bg-gray-400 text-gray-900';
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto max-w-md"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8 mx-auto max-w-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Latest from GitHub</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Recent repositories and open-source contributions
          </p>
        </motion.div>

        {/* GitHub Projects */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {githubProjects?.slice(0, 3).map((project, index) => (
            <motion.div key={index} variants={staggerItem}>
              <TiltCard className="group relative">
                {/* Gradient header bar */}
                <div className={`h-1 w-full rounded-t-2xl bg-gradient-to-r ${languageGradients[project.language] || "from-gray-400 to-gray-500"}`} />

                {/* Hover glow overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 dark:group-hover:from-blue-500/10 dark:group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />

                <div
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-b-2xl rounded-t-none p-6 shadow-lg group-hover:border-blue-200 dark:group-hover:border-blue-700 transition-all duration-300"
                  data-testid={`project-card-${index}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Code2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{project.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(project.updated_at)}</span>
                      </div>
                      {project.stars > 0 && (
                        <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                          <span className="text-yellow-700 dark:text-yellow-300 font-medium text-xs">{project.stars}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {project.language && (
                      <Badge className={`text-xs ${getLanguageColor(project.language)}`}>
                        {project.language}
                      </Badge>
                    )}
                    <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="text-xs px-3 py-1 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/30 dark:hover:border-blue-600"
                        data-testid={`button-view-project-${index}`}
                      >
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Code
                        </a>
                      </Button>
                    </motion.div>
                  </div>

                  {project.topics && project.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      {project.topics.slice(0, 3).map((topic, topicIndex) => (
                        <Badge
                          key={topicIndex}
                          variant="outline"
                          className="text-xs px-2 py-0.5 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </TiltCard>
            </motion.div>
          )) || (
            <div className="col-span-full text-center py-12">
              <Github className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No GitHub projects available at the moment.</p>
            </div>
          )}
        </motion.div>

        {/* View More Button */}
        {githubProjects && githubProjects.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.div whileHover={buttonHover} whileTap={buttonTap} className="inline-block">
              <Button
                asChild
                size="lg"
                className="bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white px-8 py-3 text-lg font-medium rounded-xl"
                data-testid="button-view-more-projects"
              >
                <a href="https://github.com/LakshmiSravyaVedantham/" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5 mr-2" />
                  View More Projects on GitHub
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
