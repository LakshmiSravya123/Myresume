import type { ResumeData } from "@shared/schema";

// Lakshmi Sravya Vedantham's portfolio data extracted from her resume
export const portfolioData: ResumeData = {
  personalInfo: {
    name: "Lakshmi Sravya Vedantham",
    title: "Data Scientist",
    email: "lakshmisravya.vedantham@gmail.com",
    phone: "9592228822",
    github: "https://github.com/LakshmiSravyaVedantham/",
    linkedin: "https://www.linkedin.com/in/lakshmisravyavedantham",
    location: "San Jose, California",
    summary: "Data scientist skilled in building modern data-driven solutions like predictive models and interactive dashboards. Focused on delivering clear, impactful insights using cutting-edge tools, guided by a spiritual perspective that brings clarity and purpose to analytics."
  },
  workExperience: [
    {
      company: "Co-operators",
      position: "Sr. Data Modeling Engineer",
      duration: "October 2022 - February 2025",
      location: "Toronto, Canada",
      description: [
        "Developed interactive applications using D3.js, Plotly, and Streamlit to deliver advanced data visualizations, enabling real-time reporting and intuitive navigation for cross-functional teams",
        "Led modernization of legacy systems with microservices architecture using Docker and Kubernetes, incorporating streamlined UI/UX designs to enhance functionality and reduce manual operations",
        "Built high-accuracy policy pricing models with TensorFlow, PyTorch, and scikit-learn, paired with statistical modeling in R, to drive predictive analytics on large-scale datasets",
        "Optimized BAU processes through workflow automation, designing user-friendly dashboards with Streamlit, Tableau, and Power BI for data-driven decision-making",
        "Mentored teams in building scalable, data-driven applications, leveraging Elasticsearch, Tableau, and Streamlit for dynamic visualization and real-time analytics",
        "Implemented optimized dimensional data models, aligning source-to-target mapping for insurance policy and claims data to ensure data integrity and enhance reporting accuracy for business stakeholders"
      ],
      technologies: ["D3.js", "Plotly", "Streamlit", "Docker", "Kubernetes", "TensorFlow", "PyTorch", "scikit-learn", "R", "Tableau", "Power BI", "Elasticsearch"]
    },
    {
      company: "StackUp Technologies",
      position: "Software Engineer",
      duration: "October 2018 - June 2019",
      location: "Chennai, India",
      description: [
        "Developed responsive React.js front-end applications and visualization dashboards, integrating with internal Flask APIs to deliver real-time performance metrics and statistics for client hardware and software products",
        "Analyzed product usage data using Pandas and NumPy to assess performance and resource consumption, providing actionable insights that informed strategic planning for hardware and software development roadmaps",
        "Maintained ETL pipelines and relational databases, ensuring data integrity and optimizing the data flow from source systems through to end-user visualization, supporting accurate reporting on product production and efficiency"
      ],
      technologies: ["React.js", "Flask", "Pandas", "NumPy", "ETL", "SQL"]
    },
    {
      company: "Tata Consultancy Services",
      position: "Software Development Engineer",
      duration: "June 2015 - March 2018",
      location: "Nagpur, India",
      description: [
        "Developed and optimized an internal employee social platform using AngularJS (v1.x), JavaScript (ES6), Spring Boot, and Selenium WebDriver, delivering high-performance RESTful APIs and dynamic UI components with robust testing using Chrome DevTools and Firebug for debugging",
        "Led data-driven model development with AngularJS and Spring Framework, implementing custom directives and two-way data binding to optimize user experience, while integrating Hibernate for efficient database interactions with MySQL",
        "Enhanced platform scalability and reduced latency by optimizing Java-based backend services with Spring MVC, utilizing caching (Ehcache) and profiling tools like VisualVM to improve throughput for internal tools"
      ],
      technologies: ["AngularJS", "JavaScript", "Spring Boot", "Selenium", "Hibernate", "MySQL", "Spring MVC", "Ehcache"]
    }
  ],
  projects: [
    {
      name: "Multimodal Brain Activity Analysis Platform",
      description: "Developed a multimodal brain activity analysis platform, applying specialized neural data processing tools (NeuroML, MNE-Python) on simulated brainwave data, and integrated a transformer model (DistilBERT) and image-text analysis (CLIP) for mood detection",
      technologies: ["Python", "NeuroML", "MNE-Python", "DistilBERT", "CLIP", "NLP", "Transformers"],
      year: "2025",
      url: "https://github.com/LakshmiSravyaVedantham/BrainActivityAnalysis"
    },
    {
      name: "RAG Chatbot with LangChain & Llama 3.1",
      description: "Created a production-grade chatbot using the Retrieval-Augmented Generation pattern (LangChain) and a fine-tuned Large Language Model (Llama 3.1), leveraging vector search libraries (FAISS, Pinecone) for fast, context-aware responses",
      technologies: ["Python", "LangChain", "Llama 3.1", "FAISS", "Pinecone", "RAG", "NLP"],
      year: "2025",
      url: "https://github.com/LakshmiSravyaVedantham/RAG-Chatbot"
    },
    {
      name: "Full-Stack App with Monitoring & Federated Learning",
      description: "Deployed full-stack applications on Vercel with Next.js and FastAPI, setting up continuous monitoring via Prometheus and Grafana, and implementing the Flower framework to privately update models through a federated learning approach",
      technologies: ["Next.js", "FastAPI", "Vercel", "Prometheus", "Grafana", "Flower", "Federated Learning"],
      year: "2025",
      url: "https://github.com/LakshmiSravyaVedantham/FullStack-Monitoring"
    }
  ],
  skills: [
    "Python", "R", "SQL", "C++", 
    "Data Modeling", "Elasticsearch", "Grafana", "Prometheus", 
    "Predictive Modeling", "Business Intelligence", "Data Governance",
    "TensorFlow", "PyTorch", "scikit-learn", "Statistical Modeling",
    "Docker", "Kubernetes", "Streamlit", "Tableau", "Power BI",
    "React", "AngularJS", "Flask", "Spring Boot", "FastAPI", "Next.js",
    "LangChain", "RAG", "Llama 3.1", "FAISS", "Pinecone", "DistilBERT",
    "D3.js", "Plotly", "Pandas", "NumPy", "ETL"
  ],
  education: [
    {
      institution: "Northeastern University",
      degree: "Masters in Data Analytics (Minor in Applied Machine Learning) - GPA: 3.8",
      year: "2022"
    }
  ],
  achievements: [
    {
      title: "Relocation & Immigration Transition",
      duration: "March 2025 - Present",
      description: "Proactively utilized a 7-month work authorization waiting period (H4 EAD) during relocation for intensive, self-directed research and development into the latest Generative AI frameworks, machine learning operations, and brain activity modeling. Developed multimodal brain activity analysis platform, production-grade RAG chatbot, and full-stack applications with continuous monitoring."
    }
  ],
  analysis: {
    completeness: 95,
    strengths: [
      "Strong technical expertise across data science, machine learning, and AI frameworks",
      "Comprehensive experience from enterprise software development to cutting-edge AI research",
      "Proven track record with production-grade ML models and full-stack deployments",
      "Leadership experience mentoring teams and building scalable data-driven applications",
      "Modern AI tool proficiency including transformers, RAG systems, and federated learning"
    ],
    improvements: [
      "Continue expanding portfolio with more advanced AI projects",
      "Document quantifiable business impact from technical implementations",
      "Build community presence through technical blog posts or open-source contributions"
    ]
  }
};