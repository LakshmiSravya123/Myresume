import type { ResumeData } from "@shared/schema";

// Lakshmi Sravya Vedantham's portfolio data extracted from her resume
export const portfolioData: ResumeData = {
  personalInfo: {
    name: "Lakshmi Sravya Vedantham",
    title: "Data Analyst & Data Scientist",
    email: "lakshmisravya.vedantham@gmail.com",

    github: "https://github.com/LakshmiSravya123/",
    linkedin: "https://www.linkedin.com/in/lakshmi-sravya-vedantham-592ba977/",
    location: "United States",
    summary: "Highly adaptable Data Analyst and Data Scientist transforming data into actionable insights through machine learning and AI-driven solutions in both software development and advanced analytics. Proficient in Python, SQL, and Machine Learning, with a track record of delivering actionable insights through statistical modeling and visualization. Eager to apply skills in data-driven innovation and process optimization to a mission-driven organization."
  },
  workExperience: [],
  projects: [
    {
      name: "Dream & Mood Analysis with EEG",
      description: "Python-based application analyzing dreams and moods using simulated EEG data for brain-computer interface inputs with NLP emotional pattern detection",
      technologies: ["Python", "NLP", "NLTK", "spaCy", "Matplotlib", "Seaborn", "EEG Data", "BCI"],
      year: "2025",
      url: "https://github.com/LakshmiSravya123/DreamAnalysis"
    },
    {
      name: "RAG Chatbot with LangChain",
      description: "Context-aware chatbot using Retrieval-Augmented Generation with Python, Streamlit, LangChain and Hugging Face transformers",
      technologies: ["Python", "Streamlit", "LangChain", "Hugging Face", "RAG", "NLP"],
      year: "2025",
      url: "https://github.com/LakshmiSravya123/langchain"
    },
    {
      name: "AI-Driven Policy Pricing Model",
      description: "Advanced machine learning model for automatic insurance policy pricing with statistical analysis and competitive positioning improvements",
      technologies: ["Python", "Machine Learning", "Statistical Analysis", "Data Modeling", "Scikit-learn"],
      year: "2024",
      url: "https://github.com/LakshmiSravya123/AI-Policy-Pricing-Model"
    },
    {
      name: "React Data Science Dashboard",
      description: "Comprehensive redevelopment of data science project using React, Python, and Flask with user-centric interfaces and reusable components",
      technologies: ["React", "Python", "Flask", "Data Visualization", "JavaScript", "REST APIs"],
      year: "2019",
      url: "https://github.com/LakshmiSravya123/React-Data-Science-Dashboard"
    },
    {
      name: "Mobile AI Development",
      description: "iOS and Android applications developed using cutting-edge AI tools like Cursor, Runway, and Luma for enhanced development workflow",
      technologies: ["iOS", "Android", "Cursor", "Runway", "Luma", "Swift", "Kotlin"],
      year: "2025",
      url: "https://github.com/LakshmiSravya123/Mobile-AI-Development"
    },
    {
      name: "Automation Efficiency Tools",
      description: "AI-driven automation tools that resulted in 70% operational efficiency improvements at Co-operators",
      technologies: ["Python", "AI Automation", "Process Optimization", "Machine Learning"],
      year: "2024",
      url: "https://github.com/LakshmiSravya123/Automation-Efficiency-Tools"
    },
    {
      name: "Data Analytics Portfolio",
      description: "Comprehensive collection of data science projects showcasing almost a decade of expertise in statistical modeling, machine learning, and data visualization",
      technologies: ["Python", "R", "Tableau", "SQL", "Jupyter", "Power BI", "Pandas", "NumPy"],
      year: "2024",
      url: "https://github.com/LakshmiSravya123/Data-Analytics-Portfolio"
    }
  ],
  skills: [
    "Python", "SQL", "Machine Learning", "React"
  ],
  education: [
    {
      institution: "Northeastern University",
      degree: "Masters in AI",
      year: "2020-2022"
    },
    {
      institution: "Sastra University",
      degree: "Bachelors of Technology in Chemical Engineering",
      year: "2011-2015"
    }
  ],
  achievements: [
    {
      title: "Part-time Coding Instructor",
      duration: "Sep 2021 – Aug 2025", 
      description: "Mentored and taught coding and AI concepts (Python, R, Tableau) to graduate students, demonstrating strong leadership and an ability to distill complex technical topics for diverse audiences"
    }
  ],
  analysis: {
    completeness: 95,
    strengths: [
      "Strong technical expertise in data science and machine learning",
      "Leadership experience mentoring junior analysts",
      "Diverse experience across multiple industries",
      "Proven track record of efficiency improvements",
      "Modern AI tool proficiency"
    ],
    improvements: [
      "Consider adding specific project metrics and outcomes",
      "Include certifications if available",
      "Add portfolio website or demo links for projects"
    ]
  }
};