import { motion } from "framer-motion";
import professionalPhoto from "@assets/6F3E376A-FD9E-4A42-BAC0-69D9A66F2453_1_201_a_1758236938466.jpeg";

export default function AboutSection() {
  return (
    <section id="about" className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
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
                className="relative w-full max-w-sm mx-auto rounded-lg object-cover shadow-xl aspect-square border border-gray-200"
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                About Me
              </h2>
              
              <div className="prose prose-lg text-gray-700 leading-relaxed space-y-4">
                <p>
                  Hey there! I'm a cheerful data scientist rooted in San Jose, California, turning data into fun, actionable magic with my Master's in Data Analytics (Minor in Applied Machine Learning) from Northeastern University. I love playing with Python, R, SQL, TensorFlow, and LangChain to create lively predictive models and dashboards. My spiritual joy adds purpose, making every project—decoding brain waves or scaling systems—a happy, clear adventure!
                </p>
                
                <p>
                  My career's a joyful ride, from spicing up legacy systems with microservices and Docker at Co-operators to crafting smart chatbots and real-time monitors with Prometheus and Grafana during my relocation. I've honed my skills at StackUp Technologies and Tata Consultancy Services, building apps, streamlining ETL pipelines, and cheering teams to unlock data's potential—each project a bright canvas of tech and puzzle-solving fun!
                </p>
                
                <p>
                  In my free time, I grin while nurturing thriving indoor plants (they grow with me!) and singing tunes that match my spiritual vibe. This harmony fuels my mission to use data for positive change, crafting innovative, heartfelt solutions that keep me humming with purpose!
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}