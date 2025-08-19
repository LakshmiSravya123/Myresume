import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Github, ExternalLink, Star, GitFork, Clock, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

export default function ProjectsSection() {
  const { data: githubProjects, isLoading } = useQuery<GitHubProject[]>({
    queryKey: ["/api/github/projects"],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
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
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-4 mx-auto max-w-md"></div>
              <div className="h-4 bg-gray-200 rounded mb-8 mx-auto max-w-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Github className="w-12 h-12 text-gray-900 mr-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Latest GitHub Projects</h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Recent repositories and open-source contributions directly from GitHub
          </p>
        </motion.div>

        {/* GitHub Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {githubProjects?.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:border-blue-200 transition-all duration-300"
              data-testid={`project-card-${index}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-5 h-5 text-gray-600" />
                    <h4 className="text-xl font-bold text-gray-900">{project.name}</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{project.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{project.stars}</span>
                  </div>
                  {project.forks !== undefined && (
                    <div className="flex items-center space-x-1">
                      <GitFork className="w-4 h-4" />
                      <span>{project.forks}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(project.updated_at)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {project.language && (
                  <Badge className={`text-xs ${getLanguageColor(project.language)}`}>
                    {project.language}
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="text-xs px-3 py-1 hover:bg-blue-50 hover:border-blue-300"
                  data-testid={`button-view-project-${index}`}
                >
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Code
                  </a>
                </Button>
              </div>

              {project.topics && project.topics.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
                  {project.topics.slice(0, 3).map((topic, topicIndex) => (
                    <Badge 
                      key={topicIndex} 
                      variant="outline" 
                      className="text-xs px-2 py-0.5 text-gray-600 border-gray-300"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>
          )) || (
            <div className="col-span-full text-center py-12">
              <Github className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No GitHub projects available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}