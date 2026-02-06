import { motion } from "framer-motion";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
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
                  Hey there! I'm a data scientist and AI enthusiast hooked on turning raw data into stories that inspire. With Python and machine learning, I create projects like apps and dashboards that make tech feel approachable and human. You'll find my work on GitHub, Hugging Face, or no-code platforms like Glide, where I blend functionality with a touch of creativity.
                </p>
                
                <p>
                  Spirituality is my compass. Meditation keeps me centered, clearing my mind for sharper insights in both code and life. My indoor plants—my little green crew—teach me patience and growth, mirroring how I nurture data into something meaningful. Singing, from soulful mantras to spontaneous tunes, is my way of letting my spirit soar, infusing my projects with heart.
                </p>
                
                <p>
                  I'm all about building tech that connects and uplifts, from exploring AI ethics to crafting tools that spark joy. When I'm not coding or tending to my plants, I'm singing or dreaming up ways to make technology and human connection vibe together. Thanks for stopping by—stay tuned for more of my journey with AI, spirit, and song!
                </p>
              </div>

              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg mt-4"
                onClick={() => window.open('https://lakshmisravya123.github.io/career-path/', '_blank')}
                data-testid="button-career-journey"
              >
                <Map className="h-5 w-5 mr-2" />
                Career Journey
              </Button>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}