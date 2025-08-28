import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { User, MapPin, Mail, Award, TrendingUp } from "lucide-react";
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

          </motion.div>
        </div>
      </div>
    </section>
  );
}