import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Card3D from "@/components/Card3D";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  year: string;
  url: string;
}

interface GitHubProject {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  updated_at: string;
  topics?: string[];
}

interface ResumeData {
  projects: Project[];
}

const languageColors: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#2b7489",
  JavaScript: "#f1e05a",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 17L17 7M17 7H7M17 7v10"
      />
    </svg>
  );
}

export default function ProjectsTab() {
  const { data: portfolioData } = useQuery<ResumeData>({
    queryKey: ["portfolio"],
    queryFn: async () => { const res = await apiRequest("GET", "/api/portfolio"); return res.json(); },
  });

  const { data: githubProjects } = useQuery<GitHubProject[]>({
    queryKey: ["github-projects"],
    queryFn: async () => { const res = await apiRequest("GET", "/api/github/projects"); return res.json(); },
  });

  const featured = portfolioData?.projects?.slice(0, 3) ?? [];
  const githubItems = githubProjects?.slice(0, 4) ?? [];

  return (
    <motion.div
      key="projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex flex-col items-center justify-center h-screen px-8 select-none"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold gradient-text-cyan">
            Projects
          </h2>
          <p className="font-mono text-xs text-cyan-400/50 mt-1">
            // featured work
          </p>
        </div>

        {/* Featured Projects */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {featured.map((project) => (
            <motion.div key={project.name} variants={cardVariant}>
              <Card3D>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 h-full"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-bold text-base leading-tight">
                      {project.name}
                    </h3>
                    <span className="font-mono text-xs text-cyan-400 shrink-0 ml-2">
                      {project.year}
                    </span>
                  </div>

                  <p className="text-sm text-[#94a3b8] leading-relaxed mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="glass text-[10px] font-mono text-cyan-300/70 px-2 py-0.5 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-[#475569] text-xs group-hover:text-cyan-400 transition-colors duration-300">
                    <span className="mr-1">View project</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowIcon />
                    </span>
                  </div>
                </a>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>

        {/* GitHub Section */}
        <div>
          <p className="font-mono text-xs text-cyan-400/50 mb-3 text-center">
            // latest from github
          </p>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {githubItems.map((repo) => (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={cardVariant}
                whileHover={{ scale: 1.03, y: -2 }}
                className="glass rounded-lg p-3 group transition-all duration-300 hover:border-cyan-400/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="text-white text-sm font-semibold truncate">
                    {repo.name}
                  </h4>
                </div>

                <p className="text-[11px] text-[#64748b] leading-relaxed line-clamp-2 mb-2">
                  {repo.description}
                </p>

                <div className="flex items-center gap-3 text-[10px] text-[#475569]">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            languageColors[repo.language] ?? "#6e7681",
                        }}
                      />
                      {repo.language}
                    </span>
                  )}
                  {repo.stars > 0 && (
                    <span className="flex items-center gap-0.5">
                      <svg
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                      </svg>
                      {repo.stars}
                    </span>
                  )}
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
