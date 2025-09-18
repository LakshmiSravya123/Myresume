import { motion } from "framer-motion";
import professionalPhoto from "@assets/stock_images/professional_headsho_563743ba.jpg";

export default function AboutSection() {
  return (
    <section id="about" className="pt-32 pb-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
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
                className="w-full max-w-md mx-auto rounded-2xl object-cover shadow-2xl"
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
                  Welcome to my world, where code meets soul, and data dances with nature! I'm a data scientist and AI enthusiast with a passion for turning patterns into insights, blending technology with spirituality and creativity.
                </p>
                
                <p>
                  Skilled in Python, machine learning, and AI tools like Retrieval-Augmented Generation (RAG), I build innovative solutions like EEG-based brain-computer interfaces (BCI) to explore moods and dreams. My work aims to harmonize tech with the human experience, shared through GitHub, Hugging Face, or no-code platforms like Glide.
                </p>
                
                <p>
                  Spirituality shapes my life. Meditation grounds me, fueling clarity in my projects. My love for plants—my thriving indoor jungle—mirrors my approach to nurturing data into insights. Singing, from mantras to melodies, is my soul's expression, infusing my work with authenticity.
                </p>
                
                <p>
                  I'm driven to create meaningful technology, from AI chatbots to intuitive dashboards, that inspires and connects. When not coding or meditating, I'm exploring AI ethics, MLOps, or singing to my plants, envisioning a future where innovation and human connection thrive.
                </p>
                
                <p>
                  Thanks for stopping by! I'm excited to share my journey of data, spirit, and growth. Stay tuned for more!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}