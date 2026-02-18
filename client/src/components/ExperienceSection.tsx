import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Building, MapPin, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { ResumeData } from "@shared/schema";

export default function ExperienceSection() {
  const { data: portfolioData } = useQuery<ResumeData>({
    queryKey: ["/api/portfolio"],
  });

  if (!portfolioData) {
    return <div>Loading...</div>;
  }

  const { workExperience } = portfolioData;

  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Professional Experience</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A journey through data-driven innovation and technical excellence across multiple industries
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600 transform md:-translate-x-1/2"></div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {workExperience.map((job, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col md:gap-12`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-800 shadow-lg transform md:-translate-x-1/2 z-10"></div>

                {/* Content card */}
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} pl-12 md:pl-0`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    {/* Animated accent bar */}
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                      viewport={{ once: true }}
                      style={{ transformOrigin: "top" }}
                    />

                    {/* Company header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{job.position}</h3>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium mb-2">
                          <Building className="h-4 w-4 mr-2" />
                          {job.company}
                        </div>
                        <div className="flex flex-wrap items-center text-gray-500 dark:text-gray-400 text-sm gap-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {job.duration}
                          </div>
                          {job.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Job description */}
                    <div className="space-y-3 mb-6">
                      {job.description.map((point, pointIndex) => (
                        <div key={pointIndex} className="flex items-start space-x-3">
                          <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>

                    {/* Technologies */}
                    {job.technologies && job.technologies.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Technologies & Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Decorative element */}
                    <div className={`absolute -top-2 ${
                      index % 2 === 0 ? '-right-2' : '-left-2'
                    } w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20`}></div>
                  </motion.div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden md:block w-1/2"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
