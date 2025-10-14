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
                  Hey! I'm a cheerful data scientist turning data into fun with my Master's in Data Analytics and a touch of Machine Learning. I love messing around with Python, R, SQL, TensorFlow, and LangChain to create cool models and dashboards. My happy spirit makes every project—like decoding brain waves or boosting systems—a clear, joyful ride!
                </p>
                
                <p>
                  My career's been a total blast! I spruced up old systems with microservices and Docker at Co-operators, built smart chatbots and real-time trackers with Prometheus and Grafana, and had a great time at StackUp Technologies and Tata Consultancy Services making apps, streamlining data pipelines, and firing up teams to make data pop. Every task is like solving a fun puzzle!
                </p>
                
                <p>
                  When I'm not geeking out, I'm grinning over my thriving indoor plants (they're like my buddies!) and singing tunes that vibe with my soul. This joy keeps me pumped to create data solutions that spread good vibes and keep me humming with purpose!
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}