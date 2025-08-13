import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { User, MapPin, Mail, Phone, Award, TrendingUp } from "lucide-react";
import type { ResumeData } from "@shared/schema";

export default function AboutSection() {
  const { data: portfolioData } = useQuery<ResumeData>({
    queryKey: ["/api/portfolio"],
  });

  if (!portfolioData) {
    return <div>Loading...</div>;
  }

  const { personalInfo, analysis } = portfolioData;

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image and Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 relative overflow-hidden">
              {/* Profile placeholder with initials */}
              <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-6xl font-bold text-white">LSV</span>
              </div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Award className="h-6 w-6 text-blue-600" />
              </motion.div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{personalInfo.name}</h3>
                <p className="text-lg text-gray-600 mb-4">{personalInfo.title}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{personalInfo.location}</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{personalInfo.email}</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{personalInfo.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description and Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Summary</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Highly adaptable Data Analyst and Data Scientist with 6+ years of experience in both software development and
                advanced analytics. Proficient in Python, SQL, and Machine Learning, with a track record of delivering actionable
                insights through statistical modeling and visualization. Eager to apply skills in data-driven innovation and process
                optimization to a mission-driven organization.
              </p>
            </div>

            {/* Key Strengths */}
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Strengths</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis?.strengths?.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-100"
                  >
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Resume Completeness */}
            {analysis && (
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Completeness</h4>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Overall Score</span>
                    <span className="text-2xl font-bold text-blue-600">{analysis.completeness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${analysis.completeness}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Comprehensive profile showcasing technical expertise and professional experience
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}