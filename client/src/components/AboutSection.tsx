import { motion } from "framer-motion";
import { Link } from "wouter";
import { BarChart3, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import professionalPhoto from "@assets/6F3E376A-FD9E-4A42-BAC0-69D9A66F2453_1_201_a_1758236938466.jpeg";

export default function AboutSection() {
  return (
    <section id="about" className="pt-32 pb-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              <img
                src={professionalPhoto}
                alt="Lakshmi Sravya Vedantham"
                className="w-full max-w-sm mx-auto rounded-2xl object-cover shadow-2xl aspect-square"
                data-testid="about-profile-image"
              />
            </div>
          </motion.div>

          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">About Me</h2>
              
              <div className="prose prose-lg text-gray-600 leading-relaxed space-y-4">
                <p>
                  I'm a data scientist skilled in building modern data-driven solutions like predictive models and interactive dashboards. With a Master's in Data Analytics (Minor in Applied Machine Learning) from Northeastern University, I focus on delivering clear, impactful insights using cutting-edge tools including Python, R, SQL, and advanced analytics platforms.
                </p>
                
                <p>
                  My recent work spans developing multimodal brain activity analysis platforms with transformer models, creating production-grade chatbots using Retrieval-Augmented Generation (LangChain, Llama 3.1), and deploying full-stack applications with continuous monitoring via Prometheus and Grafana. As a Sr. Data Modeling Engineer at Co-operators, I led the modernization of legacy systems with microservices architecture and built high-accuracy policy pricing models using TensorFlow, PyTorch, and scikit-learn.
                </p>
                
                <p>
                  A spiritual perspective guides both my life and work, bringing clarity and purpose to my analytics. I'm passionate about leveraging data to solve complex problems and drive innovation through technology that makes a meaningful impact.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Project Showcase Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link href="/stocks">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[280px]"
              data-testid="button-analytics-dashboard"
            >
              <BarChart3 className="h-6 w-6 mr-3" />
              Analytics Dashboard
            </Button>
          </Link>
          
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[280px]"
            onClick={() => window.open('https://video-ai-beryl.vercel.app/index_enhanced.html', '_blank')}
            data-testid="button-ai-video-generator"
          >
            <Video className="h-6 w-6 mr-3" />
            AI Video Generator
          </Button>
        </motion.div>
      </div>
    </section>
  );
}