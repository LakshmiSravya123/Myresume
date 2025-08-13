import type { ResumeData } from "@shared/schema";

// Lakshmi Sravya Vedantham's portfolio data extracted from her resume
export const portfolioData: ResumeData = {
  personalInfo: {
    name: "Lakshmi Sravya Vedantham",
    title: "Data Analyst & Data Scientist",
    email: "lakshmisravya.vedantham@gmail.com",
    phone: "959-222-8822",
    github: "https://github.com/LakshmiSravya123/",
    linkedin: "https://www.linkedin.com/in/lakshmi-sravya-vedantham-592ba977/",
    location: "United States"
  },
  workExperience: [
    {
      company: "Relocation & Immigration Transition",
      position: "AI/App Developer",
      duration: "Mar 2025 - Present",
      location: "United States",
      description: [
        "Proactively leveraged AI tools and platforms (e.g., Cursor, Runway, Luma etc.) to develop and launch iOS and Android applications while awaiting work authorization."
      ],
      technologies: ["Cursor", "Runway", "Luma", "iOS Development", "Android Development", "AI Tools"]
    },
    {
      company: "Co-operators",
      position: "Senior Data Modeling & Reporting Analyst",
      duration: "Oct 2022 – Feb 2025",
      location: "Toronto, ON",
      description: [
        "Led AI-driven automation initiatives to redesign applications, resulting in a 70% increase in operational efficiency by automating BAU tasks.",
        "Developed advanced auto policy pricing models using statistical methods, significantly improving pricing accuracy and competitive positioning.",
        "Mentored and trained junior analysts and supervised two interns annually, demonstrating leadership and knowledge-sharing abilities."
      ],
      technologies: ["Python", "SQL", "Machine Learning", "Statistical Modeling", "Data Analysis", "AI Automation"]
    },
    {
      company: "StackUp Technologies",
      position: "Software Developer",
      duration: "Oct 2018 – June 2019",
      location: "Chennai, India",
      description: [
        "Developed APIs for seamless system integration and built responsive front-end applications, enhancing code efficiency.",
        "Led the redevelopment of a data science project using React, Python, and Flask, designing user-centric interfaces and reusable components."
      ],
      technologies: ["React", "Python", "Flask", "APIs", "JavaScript", "Front-end Development"]
    },
    {
      company: "Tata Consultancy Services",
      position: "System Engineer",
      duration: "June 2015 – March 2018",
      location: "Nagpur, India",
      description: [
        "Led module development with AngularJS, Spring, and Selenium, directing a remote team to improve collaboration and productivity.",
        "Designed custom directives and optimized performance using browser debugging tools."
      ],
      technologies: ["AngularJS", "Spring", "Selenium", "Java", "JavaScript", "Team Leadership"]
    }
  ],
  projects: [
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
      description: "Comprehensive collection of data science projects showcasing 6+ years of expertise in statistical modeling, machine learning, and data visualization",
      technologies: ["Python", "R", "Tableau", "SQL", "Jupyter", "Power BI", "Pandas", "NumPy"],
      year: "2024",
      url: "https://github.com/LakshmiSravya123/Data-Analytics-Portfolio"
    }
  ],
  skills: [
    "Python", "R", "SQL", "JavaScript", "Java", "C++",
    "Tableau", "Power BI", "MicroStrategy",
    "Scikit-learn", "TensorFlow", "PyTorch", "Streamlit", "Pandas", "NumPy",
    "MySQL", "PostgreSQL", "Azure", "Google Cloud",
    "Git", "Jupyter", "VS Code", "Excel", "Cursor", "Runway", "Luma", "Stable Diffusion",
    "React", "AngularJS", "Flask", "Spring"
  ],
  education: [
    {
      institution: "Graduate Studies",
      degree: "Advanced Analytics & Data Science",
      year: "2021-2025"
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