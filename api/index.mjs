// server/vercel-handler.ts
import express from "express";
import cors from "cors";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  resumes;
  conversations;
  messages;
  constructor() {
    this.resumes = /* @__PURE__ */ new Map();
    this.conversations = /* @__PURE__ */ new Map();
    this.messages = /* @__PURE__ */ new Map();
  }
  async createResume(insertResume) {
    const id = randomUUID();
    const resume = {
      id,
      filename: insertResume.filename,
      content: insertResume.content,
      parsedData: insertResume.parsedData || {},
      uploadedAt: /* @__PURE__ */ new Date()
    };
    this.resumes.set(id, resume);
    return resume;
  }
  async getResume(id) {
    return this.resumes.get(id);
  }
  async getLatestResume() {
    const resumeArray = Array.from(this.resumes.values());
    return resumeArray.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];
  }
  async updateResumeParsedData(id, parsedData) {
    const resume = this.resumes.get(id);
    if (!resume) {
      throw new Error("Resume not found");
    }
    const updatedResume = { ...resume, parsedData };
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }
  async createConversation(insertConversation) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const conversation = {
      id,
      resumeId: insertConversation.resumeId || null,
      messages: insertConversation.messages || [],
      createdAt: now,
      updatedAt: now
    };
    this.conversations.set(id, conversation);
    return conversation;
  }
  async getConversation(id) {
    return this.conversations.get(id);
  }
  async getLatestConversation(resumeId) {
    const conversationArray = Array.from(this.conversations.values());
    const filtered = resumeId ? conversationArray.filter((c) => c.resumeId === resumeId) : conversationArray;
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }
  async createMessage(insertMessage) {
    const id = randomUUID();
    const message = {
      ...insertMessage,
      id,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.messages.set(id, message);
    return message;
  }
  async getMessagesByConversation(conversationId) {
    return Array.from(this.messages.values()).filter((m) => m.conversationId === conversationId).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  async getChatMessages(conversationId) {
    const messages2 = await this.getMessagesByConversation(conversationId);
    return messages2.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp
    }));
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  content: text("content").notNull(),
  parsedData: json("parsed_data").notNull().default({}),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull()
});
var conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resumeId: varchar("resume_id").references(() => resumes.id),
  messages: json("messages").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id).notNull(),
  role: varchar("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});
var insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  uploadedAt: true
});
var insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true
});

// server/services/openai.ts
import OpenAI from "openai";

// server/services/portfolioData.ts
var portfolioData = {
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
    "Python",
    "R",
    "SQL",
    "C++",
    "Data Modeling",
    "Elasticsearch",
    "Grafana",
    "Prometheus",
    "Predictive Modeling",
    "Business Intelligence",
    "Data Governance",
    "TensorFlow",
    "PyTorch",
    "scikit-learn",
    "Statistical Modeling",
    "Docker",
    "Kubernetes",
    "Streamlit",
    "Tableau",
    "Power BI",
    "React",
    "AngularJS",
    "Flask",
    "Spring Boot",
    "FastAPI",
    "Next.js",
    "LangChain",
    "RAG",
    "Llama 3.1",
    "FAISS",
    "Pinecone",
    "DistilBERT",
    "D3.js",
    "Plotly",
    "Pandas",
    "NumPy",
    "ETL"
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

// server/services/openai.ts
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
async function generateChatResponseWithOpenAI(messages2) {
  try {
    console.log(`Processing query with OpenAI`);
    const userMessage = messages2[messages2.length - 1]?.content || "";
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for Lakshmi Sravya Vedantham's personal portfolio website. You have access to her complete professional background and should provide detailed, personalized responses about her career, skills, and experience.

PORTFOLIO CONTEXT:
${JSON.stringify(portfolioData, null, 2)}

Instructions:
- Provide accurate information based only on her resume and portfolio data
- Be professional, concise, and engaging
- Highlight relevant experience, skills, and achievements
- If asked about something not in her background, politely clarify what she does have experience with
- Focus on her strengths and career accomplishments
- Keep responses conversational but professional`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.9
    });
    return completion.choices[0]?.message?.content?.trim() || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("OpenAI error:", error);
    return generateFallbackResponse(messages2[messages2.length - 1]?.content || "");
  }
}
async function analyzeResumeWithOpenAI(resumeText) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyzer. Analyze the provided resume and return structured JSON data with insights about completeness, strengths, and areas for improvement."
        },
        {
          role: "user",
          content: `Please analyze this resume and provide structured feedback in JSON format. Focus on:
- Overall completeness score (0-100)
- Key strengths (array of strings)
- Areas for improvement (array of strings)
- Technical skills assessment
- Experience relevance

Resume text:
${resumeText}

Please respond with valid JSON only.`
        }
      ],
      max_tokens: 800,
      temperature: 0.3
    });
    const response = completion.choices[0]?.message?.content?.trim();
    try {
      return JSON.parse(response || "{}");
    } catch {
      return {
        analysis: {
          completeness: 85,
          strengths: ["Strong technical background", "Comprehensive experience", "Professional presentation"],
          improvements: ["Add more quantifiable achievements", "Include specific project outcomes", "Consider adding certifications"]
        }
      };
    }
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    return {
      analysis: {
        completeness: 80,
        strengths: ["Professional experience", "Technical skills", "Educational background"],
        improvements: ["Add more metrics and achievements", "Include project details", "Consider highlighting leadership experience"]
      }
    };
  }
}
function generateFallbackResponse(query) {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes("experience") || lowerQuery.includes("work") || lowerQuery.includes("job")) {
    return `Lakshmi has comprehensive experience as a data scientist and software engineer spanning over a decade. Most recently, she served as a Sr. Data Modeling Engineer at Co-operators (October 2022 - February 2025) in Toronto, where she developed interactive applications using D3.js, Plotly, and Streamlit, and led the modernization of legacy systems with microservices architecture using Docker and Kubernetes.

Previously, she worked as a Software Engineer at StackUp Technologies (2018-2019) developing React.js front-end applications and Flask APIs, and as a Software Development Engineer at Tata Consultancy Services (2015-2018) building enterprise platforms with AngularJS and Spring Boot.

Currently, she's in a relocation transition period, focusing on intensive research and development in Generative AI frameworks, machine learning operations, and brain activity modeling.`;
  }
  if (lowerQuery.includes("skill") || lowerQuery.includes("technolog") || lowerQuery.includes("programming")) {
    return `Lakshmi has expertise across multiple technology domains:

**Programming Languages**: Python, R, SQL, C++
**Data & Analytics**: Tableau, Power BI, Streamlit, D3.js, Plotly, Pandas, NumPy, ETL
**Machine Learning & AI**: TensorFlow, PyTorch, scikit-learn, Statistical Modeling, LangChain, RAG, Llama 3.1, FAISS, Pinecone, DistilBERT
**Cloud & Infrastructure**: Docker, Kubernetes, Elasticsearch, Grafana, Prometheus
**Web Development**: React, AngularJS, Flask, Spring Boot, FastAPI, Next.js
**Specializations**: Data Modeling, Predictive Modeling, Business Intelligence, Data Governance, Federated Learning

Her diverse skill set spans from traditional data analysis to cutting-edge AI and machine learning frameworks.`;
  }
  if (lowerQuery.includes("project") || lowerQuery.includes("achievement")) {
    return `Lakshmi has worked on several cutting-edge projects:

**Multimodal Brain Activity Analysis Platform (2025)**: Developed a platform applying specialized neural data processing tools (NeuroML, MNE-Python) on simulated brainwave data, and integrated transformer models (DistilBERT) and image-text analysis (CLIP) for mood detection.

**RAG Chatbot with LangChain & Llama 3.1 (2025)**: Created a production-grade chatbot using the Retrieval-Augmented Generation pattern with fine-tuned LLM, leveraging vector search libraries (FAISS, Pinecone) for fast, context-aware responses.

**Full-Stack App with Monitoring & Federated Learning (2025)**: Deployed full-stack applications on Vercel with Next.js and FastAPI, setting up continuous monitoring via Prometheus and Grafana, and implementing the Flower framework for federated learning.

At Co-operators, she built high-accuracy policy pricing models with TensorFlow, PyTorch, and scikit-learn, and mentored teams in building scalable, data-driven applications.`;
  }
  if (lowerQuery.includes("education") || lowerQuery.includes("background")) {
    return `Lakshmi holds a Master's in Data Analytics with a Minor in Applied Machine Learning from Northeastern University (2022, GPA: 3.8). Her educational background, combined with over 10 years of hands-on experience across software development and data science, provides her with both deep theoretical knowledge and extensive practical expertise in AI, machine learning, and data-driven solutions.`;
  }
  return `Lakshmi Sravya Vedantham is a highly skilled Data Scientist with over 10 years of experience in software development and data science. She specializes in machine learning, statistical modeling, and AI-driven solutions. She has a Master's in Data Analytics with a Minor in Applied Machine Learning from Northeastern University (GPA: 3.8).

Her expertise spans programming languages like Python, R, SQL, and C++, along with cutting-edge AI frameworks such as LangChain, RAG, transformers, and federated learning. She has proven experience building production-grade ML models, modernizing legacy systems, and mentoring teams in scalable data-driven application development.

Feel free to ask more specific questions about her experience, skills, or projects!`;
}

// server/services/resumeParser.ts
function parseResumeText(content) {
  const lines = content.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
  const parsed = {
    personalInfo: {},
    workExperience: [],
    projects: [],
    skills: [],
    education: []
  };
  let currentSection = "";
  let currentItem = null;
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes("experience") || lowerLine.includes("employment")) {
      currentSection = "experience";
      continue;
    } else if (lowerLine.includes("project")) {
      currentSection = "projects";
      continue;
    } else if (lowerLine.includes("skill")) {
      currentSection = "skills";
      continue;
    } else if (lowerLine.includes("education")) {
      currentSection = "education";
      continue;
    }
    if (parsed.personalInfo.name === void 0 && line.length > 3 && !line.includes("@") && !line.includes("http")) {
      const words = line.split(" ");
      if (words.length >= 2 && words.length <= 4 && words.every((w) => /^[A-Za-z]+$/.test(w))) {
        parsed.personalInfo.name = line;
      }
    }
    const emailMatch = line.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    if (emailMatch) {
      parsed.personalInfo.email = emailMatch[0];
    }
    const phoneMatch = line.match(/(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/);
    if (phoneMatch) {
      parsed.personalInfo.phone = phoneMatch[0];
    }
    if (currentSection === "experience") {
      if (line.includes("|") || line.includes("-") || /\d{4}/.test(line)) {
        if (currentItem) {
          parsed.workExperience.push(currentItem);
        }
        currentItem = { company: "", position: "", duration: "", description: [], technologies: [] };
        const parts = line.split(/[|\-–]/);
        if (parts.length >= 2) {
          currentItem.position = parts[0].trim();
          currentItem.company = parts[1].trim();
        }
        const yearMatch = line.match(/\d{4}/g);
        if (yearMatch) {
          currentItem.duration = yearMatch.join(" - ");
        }
      } else if (currentItem) {
        currentItem.description.push(line);
        const techPatterns = /\b(JavaScript|Python|React|Node\.?js|Java|C\+\+|HTML|CSS|SQL|MongoDB|PostgreSQL|AWS|Docker|Kubernetes|Git|TypeScript|Angular|Vue|Django|Flask|Express|Spring|\.NET|Ruby|PHP|Swift|Kotlin|Go|Rust)\b/gi;
        const matches = line.match(techPatterns);
        if (matches) {
          currentItem.technologies.push(...matches);
        }
      }
    } else if (currentSection === "projects") {
      if (line.includes(":") || /\d{4}/.test(line)) {
        if (currentItem) {
          parsed.projects.push(currentItem);
        }
        currentItem = { name: "", description: "", technologies: [], year: "" };
        const colonIndex = line.indexOf(":");
        if (colonIndex > 0) {
          currentItem.name = line.substring(0, colonIndex).trim();
          currentItem.description = line.substring(colonIndex + 1).trim();
        } else {
          currentItem.name = line;
        }
        const yearMatch = line.match(/\d{4}/);
        if (yearMatch) {
          currentItem.year = yearMatch[0];
        }
      } else if (currentItem) {
        currentItem.description += " " + line;
        const techPatterns = /\b(JavaScript|Python|React|Node\.?js|Java|C\+\+|HTML|CSS|SQL|MongoDB|PostgreSQL|AWS|Docker|Kubernetes|Git|TypeScript|Angular|Vue|Django|Flask|Express|Spring|\.NET|Ruby|PHP|Swift|Kotlin|Go|Rust)\b/gi;
        const matches = line.match(techPatterns);
        if (matches) {
          currentItem.technologies.push(...matches);
        }
      }
    } else if (currentSection === "skills") {
      const skillMatches = line.split(/[,•·\-\*]/).map((s) => s.trim()).filter((s) => s.length > 0);
      parsed.skills.push(...skillMatches);
    } else if (currentSection === "education") {
      if (currentItem) {
        parsed.education.push(currentItem);
      }
      currentItem = { institution: "", degree: "", year: "" };
      const yearMatch = line.match(/\d{4}/);
      if (yearMatch) {
        currentItem.year = yearMatch[0];
      }
      if (line.toLowerCase().includes("university") || line.toLowerCase().includes("college") || line.toLowerCase().includes("institute")) {
        currentItem.institution = line;
      } else {
        currentItem.degree = line;
      }
    }
  }
  if (currentSection === "experience" && currentItem) {
    parsed.workExperience.push(currentItem);
  } else if (currentSection === "projects" && currentItem) {
    parsed.projects.push(currentItem);
  } else if (currentSection === "education" && currentItem) {
    parsed.education.push(currentItem);
  }
  parsed.skills = Array.from(new Set(parsed.skills));
  parsed.workExperience.forEach((exp) => {
    exp.technologies = Array.from(new Set(exp.technologies));
    exp.description = exp.description.join(" ").trim();
  });
  parsed.projects.forEach((proj) => {
    proj.technologies = Array.from(new Set(proj.technologies));
  });
  return parsed;
}

// server/routes.ts
import multer from "multer";
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOCX, and TXT files are allowed."));
    }
  }
});
async function registerRoutes(app2) {
  app2.post("/api/resume/upload", upload.single("resume"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const content = req.file.buffer.toString("utf-8");
      const resumeData = {
        filename: req.file.originalname,
        content,
        parsedData: null
      };
      const validatedData = insertResumeSchema.parse(resumeData);
      const resume = await storage.createResume(validatedData);
      try {
        const basicParsed = parseResumeText(content);
        const aiAnalysis = await analyzeResumeWithOpenAI(content);
        const combinedParsedData = {
          ...basicParsed,
          ...aiAnalysis,
          uploadedAt: /* @__PURE__ */ new Date()
        };
        await storage.updateResumeParsedData(resume.id, combinedParsedData);
        res.json({
          message: "Resume uploaded and analyzed successfully",
          resume: { ...resume, parsedData: combinedParsedData }
        });
      } catch (parseError) {
        console.error("Resume parsing error:", parseError);
        res.json({
          message: "Resume uploaded successfully, but analysis failed",
          resume,
          parseError: parseError.message
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload resume: " + error.message });
    }
  });
  app2.get("/api/resume/latest", async (req, res) => {
    try {
      const resume = await storage.getLatestResume();
      if (!resume) {
        return res.status(404).json({ message: "No resume found" });
      }
      res.json(resume);
    } catch (error) {
      console.error("Get resume error:", error);
      res.status(500).json({ message: "Failed to get resume: " + error.message });
    }
  });
  app2.post("/api/conversation/start", async (req, res) => {
    try {
      const { resumeId } = req.body;
      const conversation = await storage.createConversation({
        resumeId,
        messages: []
      });
      res.json(conversation);
    } catch (error) {
      console.error("Start conversation error:", error);
      res.status(500).json({ message: "Failed to start conversation: " + error.message });
    }
  });
  app2.get("/api/conversation/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const messages2 = await storage.getChatMessages(id);
      res.json(messages2);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to get messages: " + error.message });
    }
  });
  app2.post("/api/conversation/:id/message", async (req, res) => {
    try {
      const { id } = req.params;
      const { content, role = "user" } = req.body;
      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }
      const validatedMessage = insertMessageSchema.parse({
        conversationId: id,
        role,
        content
      });
      const message = await storage.createMessage(validatedMessage);
      if (role === "user") {
        try {
          const conversation = await storage.getConversation(id);
          const resume = conversation?.resumeId ? await storage.getResume(conversation.resumeId) : null;
          const resumeContext = resume?.parsedData || {};
          const recentMessages = await storage.getMessagesByConversation(id);
          const messageHistory = recentMessages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content
          }));
          const aiResponse = await generateChatResponseWithOpenAI(messageHistory);
          const aiMessage = await storage.createMessage({
            conversationId: id,
            role: "assistant",
            content: aiResponse
          });
          res.json({ userMessage: message, aiMessage });
        } catch (aiError) {
          console.error("AI response error:", aiError);
          res.json({
            userMessage: message,
            error: "Failed to generate AI response: " + aiError.message
          });
        }
      } else {
        res.json({ message });
      }
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Failed to send message: " + error.message });
    }
  });
  app2.post("/api/quick-action", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }
      console.log("Processing query with OpenAI:", query);
      const response = await generateChatResponseWithOpenAI([{ role: "user", content: query }]);
      res.json({
        response,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Quick action error:", error);
      res.status(500).json({ message: "Failed to process quick action: " + error.message });
    }
  });
  app2.get("/api/conversation/latest", async (req, res) => {
    try {
      const { resumeId } = req.query;
      const conversation = await storage.getLatestConversation(resumeId);
      if (!conversation) {
        return res.status(404).json({ message: "No conversation found" });
      }
      res.json(conversation);
    } catch (error) {
      console.error("Get latest conversation error:", error);
      res.status(500).json({ message: "Failed to get conversation: " + error.message });
    }
  });
  app2.get("/api/portfolio", async (req, res) => {
    try {
      res.json(portfolioData);
    } catch (error) {
      console.error("Get portfolio error:", error);
      res.status(500).json({ message: "Failed to get portfolio data: " + error.message });
    }
  });
  app2.get("/api/resume/download", async (req, res) => {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const resumePath = path.resolve(process.cwd(), "attached_assets/Sravya 2025 Resume October_1759863399934.pdf");
      try {
        await fs.access(resumePath);
      } catch {
        return res.status(404).json({ message: "Resume file not found" });
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="Lakshmi_Sravya_Vedantham_Resume.pdf"');
      const fileBuffer = await fs.readFile(resumePath);
      res.send(fileBuffer);
    } catch (error) {
      console.error("Resume download error:", error);
      res.status(500).json({ message: "Failed to download resume: " + error.message });
    }
  });
  app2.get("/api/github/projects", async (req, res) => {
    try {
      const githubUsername = "LakshmiSravyaVedantham";
      const githubApiUrl = `https://api.github.com/users/${githubUsername}/repos`;
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      const headers = {
        "User-Agent": "MyresumeApp/1.0",
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      };
      if (process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`;
      }
      const response = await fetch(`${githubApiUrl}?sort=updated&direction=desc&per_page=10`, {
        headers
      });
      if (!response.ok) {
        console.log("GitHub API failed, using fallback data");
        const fallbackProjects = [
          {
            name: "Myresume",
            description: "This is a personal portfolio website that showcases professional experience, technical skills, projects, and provides an AI-powered chat assistant to answer questions about the resume and career background.",
            language: "TypeScript",
            stargazers_count: 0,
            html_url: "https://github.com/LakshmiSravyaVedantham/Myresume",
            updated_at: "2025-11-10T20:48:52Z",
            topics: ["portfolio", "react", "typescript", "ai-assistant"]
          },
          {
            name: "DreamAnalysis",
            description: "Neural Dream Workshop is an innovative AI-powered system that integrates Brain-Computer Interface (BCI) technology with advanced machine learning to capture, analyze, and enhance dream experiences.",
            language: "TypeScript",
            stargazers_count: 0,
            html_url: "https://github.com/LakshmiSravyaVedantham/DreamAnalysis",
            updated_at: "2025-11-06T23:31:53Z",
            topics: ["ai", "machine-learning", "bci", "dream-analysis"]
          },
          {
            name: "promptforge",
            description: "Generate production-ready full-stack applications in 60 seconds from a single prompt.",
            language: "Python",
            stargazers_count: 0,
            html_url: "https://github.com/LakshmiSravyaVedantham/promptforge",
            updated_at: "2025-11-05T20:16:21Z",
            topics: ["ai", "code-generation", "automation"]
          },
          {
            name: "uniforge",
            description: "Automate repetitive desktop workflows by capturing keyboard patterns and replaying them through a unified desktop experience. UniForge ships as a three-service MVP: a Flask API for todo-like data, a keystroke recorder bridge, and a Vite/Electron frontend that orchestrates automation flows.",
            language: "Python",
            stargazers_count: 0,
            html_url: "https://github.com/LakshmiSravyaVedantham/uniforge",
            updated_at: "2025-11-05T02:38:46Z",
            topics: ["automation", "desktop-app", "electron"]
          },
          {
            name: "Harmony",
            description: "A Flutter-based spiritual journaling app that combines AI-powered insights, nature scanning, and health data integration to help users reflect, find purpose, and calm their minds.",
            language: "Dart",
            stargazers_count: 0,
            html_url: "https://github.com/LakshmiSravyaVedantham/Harmony",
            updated_at: "2025-10-21T21:21:56Z",
            topics: ["flutter", "mobile-app", "ai", "wellness"]
          },
          {
            name: "airflow",
            description: "A complete ETL (Extract, Transform, Load) pipeline for processing autonomous vehicle telemetry data using Apache Airflow, with optional streaming capabilities using Kafka and Spark.",
            language: "Python",
            stargazers_count: 0,
            html_url: "https://github.com/LakshmiSravyaVedantham/airflow",
            updated_at: "2025-10-16T20:43:41Z",
            topics: ["airflow", "etl", "data-engineering", "kafka"]
          }
        ];
        const processedProjects2 = fallbackProjects.map((repo) => ({
          name: repo.name,
          description: repo.description || "No description available",
          language: repo.language || "Unknown",
          stars: repo.stargazers_count,
          url: repo.html_url,
          updated_at: repo.updated_at
        }));
        return res.json(processedProjects2);
      }
      const repos = await response.json();
      const processedProjects = repos.filter((repo) => !repo.fork && !repo.private).map((repo) => ({
        name: repo.name,
        description: repo.description || "No description available",
        language: repo.language || "Unknown",
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        url: repo.html_url,
        updated_at: repo.updated_at,
        created_at: repo.created_at,
        topics: repo.topics || []
      })).slice(0, 6);
      res.json(processedProjects);
    } catch (error) {
      console.error("Get GitHub projects error:", error);
      const fallbackProjects = [
        {
          name: "Myresume",
          description: "This is a personal portfolio website that showcases professional experience, technical skills, projects, and provides an AI-powered chat assistant to answer questions about the resume and career background.",
          language: "TypeScript",
          stars: 0,
          forks: 0,
          url: "https://github.com/LakshmiSravyaVedantham/Myresume",
          updated_at: "2025-11-10T20:48:52Z",
          topics: ["portfolio", "react", "typescript", "ai-assistant"]
        },
        {
          name: "DreamAnalysis",
          description: "Neural Dream Workshop is an innovative AI-powered system that integrates Brain-Computer Interface (BCI) technology with advanced machine learning to capture, analyze, and enhance dream experiences.",
          language: "TypeScript",
          stars: 0,
          forks: 0,
          url: "https://github.com/LakshmiSravyaVedantham/DreamAnalysis",
          updated_at: "2025-11-06T23:31:53Z",
          topics: ["ai", "machine-learning", "bci", "dream-analysis"]
        },
        {
          name: "promptforge",
          description: "Generate production-ready full-stack applications in 60 seconds from a single prompt.",
          language: "Python",
          stars: 0,
          forks: 0,
          url: "https://github.com/LakshmiSravyaVedantham/promptforge",
          updated_at: "2025-11-05T20:16:21Z",
          topics: ["ai", "code-generation", "automation"]
        },
        {
          name: "uniforge",
          description: "Automate repetitive desktop workflows by capturing keyboard patterns and replaying them through a unified desktop experience.",
          language: "Python",
          stars: 0,
          forks: 0,
          url: "https://github.com/LakshmiSravyaVedantham/uniforge",
          updated_at: "2025-11-05T02:38:46Z",
          topics: ["automation", "desktop-app", "electron"]
        },
        {
          name: "Harmony",
          description: "A Flutter-based spiritual journaling app that combines AI-powered insights, nature scanning, and health data integration to help users reflect, find purpose, and calm their minds.",
          language: "Dart",
          stars: 0,
          forks: 0,
          url: "https://github.com/LakshmiSravyaVedantham/Harmony",
          updated_at: "2025-10-21T21:21:56Z",
          topics: ["flutter", "mobile-app", "ai", "wellness"]
        },
        {
          name: "airflow",
          description: "A complete ETL pipeline for processing autonomous vehicle telemetry data using Apache Airflow, with streaming capabilities using Kafka and Spark.",
          language: "Python",
          stars: 0,
          forks: 0,
          url: "https://github.com/LakshmiSravyaVedantham/airflow",
          updated_at: "2025-10-16T20:43:41Z",
          topics: ["airflow", "etl", "data-engineering", "kafka"]
        }
      ];
      res.json(fallbackProjects);
    }
  });
  const generateFallbackStockData = () => {
    const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "META", "TSLA", "NVDA", "AMD", "NFLX", "DIS"];
    const baseData = {
      "AAPL": { price: 178.45, open: 177.2, high: 179.8, low: 176.9, volume: 58234567, change: 1.25 },
      "GOOGL": { price: 142.3, open: 141.5, high: 143.2, low: 140.8, volume: 32456789, change: 0.8 },
      "MSFT": { price: 380.25, open: 378.9, high: 382.1, low: 377.5, volume: 28901234, change: 1.35 },
      "AMZN": { price: 165.8, open: 164.3, high: 167.2, low: 163.9, volume: 45678901, change: 1.5 },
      "META": { price: 485.6, open: 483.2, high: 488.4, low: 482.1, volume: 19876543, change: 2.4 },
      "TSLA": { price: 242.15, open: 240.8, high: 244.5, low: 239.6, volume: 89012345, change: 1.35 },
      "NVDA": { price: 495.3, open: 492.4, high: 498.9, low: 491.2, volume: 41234567, change: 2.9 },
      "AMD": { price: 163.75, open: 162.3, high: 165.4, low: 161.8, volume: 37890123, change: 1.45 },
      "NFLX": { price: 598.9, open: 595.2, high: 602.3, low: 594.1, volume: 14567890, change: 3.7 },
      "DIS": { price: 110.35, open: 109.5, high: 111.8, low: 108.9, volume: 21345678, change: 0.85 }
    };
    return symbols.map((symbol) => ({
      "@timestamp": (/* @__PURE__ */ new Date()).toISOString(),
      symbol,
      close: baseData[symbol].price,
      open: baseData[symbol].open,
      high: baseData[symbol].high,
      low: baseData[symbol].low,
      volume: baseData[symbol].volume
    }));
  };
  app2.get("/api/stocks/latest", async (req, res) => {
    try {
      const { Client } = await import("@elastic/elasticsearch");
      const cloudId = process.env.ES_CLOUD_ID;
      const username = process.env.ELASTICSEARCH_USERNAME;
      const password = process.env.ELASTICSEARCH_PASSWORD;
      if (!cloudId || !username || !password) {
        console.log("Elasticsearch credentials not configured, using fallback data");
        return res.json(generateFallbackStockData());
      }
      const es = new Client({
        cloud: { id: cloudId },
        auth: { username, password }
      });
      const index = process.env.ELASTIC_INDEX || "stocks_real_time";
      const size = parseInt(req.query.size) || 50;
      const pingResult = await es.ping();
      console.log("Elasticsearch ping successful:", pingResult);
      const response = await es.search({
        index,
        query: { match_all: {} },
        aggs: {
          by_symbol: {
            terms: { field: "symbol", size },
            aggs: {
              latest_doc: {
                top_hits: {
                  sort: [{ "@timestamp": { order: "desc" } }],
                  size: 1
                }
              }
            }
          }
        },
        size: 0
      });
      const buckets = response.aggregations.by_symbol.buckets;
      const data = buckets.map((bucket) => bucket.latest_doc.hits.hits[0]._source);
      res.json(data);
    } catch (error) {
      console.error("Elasticsearch latest error:", error);
      console.log("Using fallback stock data due to Elasticsearch error");
      res.json(generateFallbackStockData());
    }
  });
  app2.get("/api/stocks/timeseries", async (req, res) => {
    try {
      const { Client } = await import("@elastic/elasticsearch");
      const cloudId = process.env.ES_CLOUD_ID;
      const username = process.env.ELASTICSEARCH_USERNAME;
      const password = process.env.ELASTICSEARCH_PASSWORD;
      if (!cloudId || !username || !password) {
        console.log("Elasticsearch credentials not configured, using fallback timeseries data");
        const symbols2 = req.query.symbols?.split(",") || ["AAPL", "GOOGL", "MSFT"];
        const fallbackData = generateFallbackStockData();
        const filteredData = fallbackData.filter((d) => symbols2.includes(d.symbol));
        return res.json(filteredData.length > 0 ? filteredData : fallbackData.slice(0, 3));
      }
      const es = new Client({
        cloud: { id: cloudId },
        auth: { username, password }
      });
      const index = process.env.ELASTIC_INDEX || "stocks_real_time";
      const symbols = req.query.symbols?.split(",") || [];
      const hours = parseInt(req.query.hours) || 24;
      const response = await es.search({
        index,
        query: {
          bool: {
            filter: [
              { terms: { "symbol": symbols } }
            ]
          }
        },
        sort: [{ "@timestamp": { order: "desc" } }],
        size: 1e3
      });
      const data = response.hits.hits.map((hit) => hit._source);
      res.json(data);
    } catch (error) {
      console.error("Elasticsearch timeseries error:", error);
      console.log("Using fallback timeseries data due to Elasticsearch error");
      const symbols = req.query.symbols?.split(",") || ["AAPL", "GOOGL", "MSFT"];
      const fallbackData = generateFallbackStockData();
      const filteredData = fallbackData.filter((d) => symbols.includes(d.symbol));
      res.json(filteredData.length > 0 ? filteredData : fallbackData.slice(0, 3));
    }
  });
  app2.get("/api/stocks/symbols", async (req, res) => {
    try {
      const { Client } = await import("@elastic/elasticsearch");
      const cloudId = process.env.ES_CLOUD_ID;
      const username = process.env.ELASTICSEARCH_USERNAME;
      const password = process.env.ELASTICSEARCH_PASSWORD;
      if (!cloudId || !username || !password) {
        console.log("Elasticsearch credentials not configured, using fallback symbols");
        return res.json(["AAPL", "GOOGL", "MSFT", "AMZN", "META", "TSLA", "NVDA", "AMD", "NFLX", "DIS"]);
      }
      const es = new Client({
        cloud: { id: cloudId },
        auth: { username, password }
      });
      const index = process.env.ELASTIC_INDEX || "stocks_real_time";
      const response = await es.search({
        index,
        aggs: {
          symbols: {
            terms: { field: "symbol", size: 1e3 }
          }
        },
        size: 0
      });
      const symbols = response.aggregations.symbols.buckets.map((b) => b.key);
      res.json(symbols);
    } catch (error) {
      console.error("Elasticsearch symbols error:", error);
      console.log("Using fallback symbols due to Elasticsearch error");
      res.json(["AAPL", "GOOGL", "MSFT", "AMZN", "META", "TSLA", "NVDA", "AMD", "NFLX", "DIS"]);
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vercel-handler.ts
var app = express();
app.use(cors({
  origin: [
    "https://sravyavedantham.com",
    "https://www.sravyavedantham.com",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
registerRoutes(app);
var vercel_handler_default = app;
export {
  vercel_handler_default as default
};
