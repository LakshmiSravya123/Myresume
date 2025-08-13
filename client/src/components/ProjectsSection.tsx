import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Github, ExternalLink, Calendar, Star, GitFork, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ResumeData } from "@shared/schema";

interface GitHubProject {
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
  updated_at: string;
}

export default function ProjectsSection() {
  const { data: portfolioData } = useQuery<ResumeData>({
    queryKey: ["/api/portfolio"],
  });

  const { data: githubProjects } = useQuery<GitHubProject[]>({
    queryKey: ["/api/github/projects"],
  });

  if (!portfolioData) {
    return <div>Loading...</div>;
  }

  const { projects } = portfolioData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Featured Projects</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A showcase of data science innovations, machine learning implementations, and technical solutions
          </p>
        </motion.div>

        {/* Portfolio Projects */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Key Portfolio Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:border-blue-200 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h4>
                    <p className="text-gray-600 leading-relaxed">{project.description}</p>
                  </div>
                  {project.year && (
                    <div className="flex items-center text-sm text-gray-500 ml-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      {project.year}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  {project.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(project.github, '_blank')}
                      data-testid={`project-github-${index}`}
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </Button>
                  )}
                  {project.demo && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(project.demo, '_blank')}
                      data-testid={`project-demo-${index}`}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Demo
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* GitHub Projects */}
        {githubProjects && githubProjects.length > 0 && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Latest from GitHub</h3>
              <p className="text-gray-600">Recent repositories and contributions</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {githubProjects.map((repo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 hover:border-blue-200 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900 truncate">{repo.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        {repo.stars}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{repo.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className={`w-3 h-3 rounded-full ${
                        repo.language === 'Python' ? 'bg-blue-500' :
                        repo.language === 'JavaScript' ? 'bg-yellow-500' :
                        repo.language === 'Swift' ? 'bg-orange-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span>{repo.language}</span>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(repo.updated_at)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(repo.url, '_blank')}
                      data-testid={`github-repo-${index}`}
                    >
                      <Github className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open('https://github.com/lakshmisravya', '_blank')}
                data-testid="view-all-projects"
              >
                <Github className="h-5 w-5 mr-2" />
                View All Projects
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}