import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Code, Database, Brain, Cloud, Wrench, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ResumeData } from "@shared/schema";

export default function SkillsSection() {
  const { data: portfolioData } = useQuery<ResumeData>({
    queryKey: ["/api/portfolio"],
  });

  if (!portfolioData) {
    return <div>Loading...</div>;
  }

  const { skills } = portfolioData;

  const skillCategories = [
    {
      title: "Programming Languages",
      icon: <Code className="h-6 w-6" />,
      skills: skills.filter(skill => 
        ["Python", "R", "SQL", "JavaScript", "Java", "C++"].includes(skill)
      ),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Data & Analytics",
      icon: <Database className="h-6 w-6" />,
      skills: skills.filter(skill => 
        ["Tableau", "Power BI", "MicroStrategy", "Pandas", "NumPy", "Excel"].includes(skill)
      ),
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Machine Learning & AI",
      icon: <Brain className="h-6 w-6" />,
      skills: skills.filter(skill => 
        ["Scikit-learn", "TensorFlow", "PyTorch", "Streamlit", "Cursor", "Runway", "Luma", "Stable Diffusion"].includes(skill)
      ),
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Cloud & Databases",
      icon: <Cloud className="h-6 w-6" />,
      skills: skills.filter(skill => 
        ["MySQL", "PostgreSQL", "Azure", "Google Cloud"].includes(skill)
      ),
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200"
    },
    {
      title: "Development Tools",
      icon: <Wrench className="h-6 w-6" />,
      skills: skills.filter(skill => 
        ["Git", "Jupyter", "VS Code"].includes(skill)
      ),
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      title: "Web Frameworks",
      icon: <Palette className="h-6 w-6" />,
      skills: skills.filter(skill => 
        ["React", "AngularJS", "Flask", "Spring"].includes(skill)
      ),
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    }
  ];

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Technical Skills</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive expertise across data science, machine learning, and modern development technologies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`${category.bgColor} ${category.borderColor} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {/* Category Header */}
              <div className="flex items-center mb-6">
                <div className={`bg-gradient-to-r ${category.color} p-3 rounded-xl text-white mr-4 shadow-lg`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.skills.length} technologies</p>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skillIndex}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: skillIndex * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between"
                  >
                    <Badge 
                      variant="secondary" 
                      className="bg-white/60 text-gray-700 font-medium px-3 py-1 text-sm border-0"
                    >
                      {skill}
                    </Badge>
                    <motion.div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: skillIndex * 0.2 }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Proficiency Indicator */}
              <div className="mt-6 pt-4 border-t border-white/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Proficiency Level</span>
                  <span className="text-gray-800 font-bold">Expert</span>
                </div>
                <div className="mt-2 w-full bg-white/50 rounded-full h-2">
                  <motion.div
                    className={`bg-gradient-to-r ${category.color} h-2 rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: "90%" }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">All Technical Skills</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.02 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
              >
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm font-medium hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 cursor-pointer"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}