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
                  Hiya! I'm a super cheery data scientist, turning data into pure joy with my Master's in Data Analytics and a sprinkle of Machine Learning. I love creating cool models and dazzling dashboards, and my happy heart makes every project—whether it's cracking brain waves or boosting systems—a fun, clear adventure!
                </p>
                
                <p>
                  My career's like a secret, grin-filled party! I've spiced up systems, built chatty bots, and whipped up real-time trackers. I get a kick out of sparking apps, smoothing data flows, and cheering teams to make data shine—each job's a delightful puzzle!
                </p>
                
                <p>
                  When I'm not diving into data, I'm giggling over my thriving indoor plants (my leafy buddies!) and singing soulful tunes that vibe with my soul. This joy keeps me buzzing to create solutions that spread big smiles and good vibes!
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}