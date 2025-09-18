import { motion } from "framer-motion";
import professionalPhoto from "@assets/6F3E376A-FD9E-4A42-BAC0-69D9A66F2453_1_201_a_1758236938466.jpeg";

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
                  Hey there! I'm a data scientist and AI enthusiast who loves spinning data into stories that spark connection. Using Python, machine learning, and creative AI tools, I build projects like chatbots and dashboards that make tech feel human and approachable. From sharing code on GitHub and Hugging Face to crafting intuitive apps on platforms like Glide, I'm all about blending innovation with accessibility, always with a dash of curiosity.
                </p>
                
                <p>
                  Spirituality is my anchor, guiding both my life and work. Meditation keeps me grounded, sharpening my focus for coding and problem-solving while bringing calm to my days. My indoor plants—my thriving green companions—remind me to nurture growth, whether it's cultivating datasets or tending to my leafy friends. Singing, whether it's soulful mantras or just vibing to a favorite tune, lets my spirit shine, infusing my projects with authenticity and joy.
                </p>
                
                <p>
                  I'm passionate about creating technology that uplifts and connects. When I'm not coding or meditating, I'm exploring AI ethics, tinkering with new tools, or singing to my plants, dreaming of a world where tech and human connection flow in harmony. Thanks for stopping by—I'm excited to share more of my journey blending AI, spirit, and song!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}