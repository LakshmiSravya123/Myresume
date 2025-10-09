import { motion } from "framer-motion";
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
                  Hey there! As a cheerful data scientist planted in San Jose, California, I love turning abstract data into exciting, actionable magic with my Master's in Data Analytics and a Minor in Applied Machine Learning from Northeastern University. With a playful mix of Python, R, SQL, TensorFlow, and LangChain, I whip up predictive models and dashboards that bring data to life. My spiritual vibe adds a joyful purpose, making every project—whether decoding brain waves or building scalable systems—a delightful journey of clarity and impact!
                </p>
                
                <p>
                  My career's been a fun adventure, from jazzing up legacy systems with microservices and Docker at Co-operators to creating smart chatbots and real-time monitors with Prometheus and Grafana during my relocation transition. I've polished my skills at StackUp Technologies and Tata Consultancy Services, crafting responsive apps, streamlining ETL pipelines, and cheering on teams to unlock data's potential. Each project feels like a happy canvas where I blend tech savvy with a love for solving puzzles, leaving a sprinkle of efficiency and inspiration behind!
                </p>
                
                <p>
                  In my downtime, I'm all smiles tending to my thriving indoor plants—watching them grow mirrors my own journey—while belting out songs that harmonize with my spiritual side. This balance sparks my passion to use data as a tool for positive change, crafting solutions that shine with innovation and heart. It's a mission that keeps me humming along, connecting code to a bigger, happier purpose!
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}