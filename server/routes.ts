import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertResumeSchema, insertMessageSchema } from "@shared/schema";
import { generateChatResponseWithOpenAI, analyzeResumeWithOpenAI, checkOpenAIAvailability } from "./services/openai";
import { generateChatResponseWithOllama, analyzeResumeWithOllama, checkOllamaAvailability } from "./services/ollama";
import { parseResumeText } from "./services/resumeParser";
import { portfolioData } from "./services/portfolioData";
import multer from "multer";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload resume
  app.post("/api/resume/upload", upload.single("resume"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const content = req.file.buffer.toString('utf-8');
      
      const resumeData = {
        filename: req.file.originalname,
        content: content,
        parsedData: null
      };

      const validatedData = insertResumeSchema.parse(resumeData);
      const resume = await storage.createResume(validatedData);

      // Parse resume in background
      try {
        const basicParsed = parseResumeText(content);
        // Use OpenAI for AI analysis
        const aiAnalysis = await analyzeResumeWithOpenAI(content);
        
        const combinedParsedData = {
          ...basicParsed,
          ...aiAnalysis,
          uploadedAt: new Date()
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
          parseError: (parseError as any).message
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload resume: " + (error as any).message });
    }
  });

  // Get latest resume
  app.get("/api/resume/latest", async (req, res) => {
    try {
      const resume = await storage.getLatestResume();
      if (!resume) {
        return res.status(404).json({ message: "No resume found" });
      }
      res.json(resume);
    } catch (error) {
      console.error("Get resume error:", error);
      res.status(500).json({ message: "Failed to get resume: " + (error as any).message });
    }
  });

  // Start new conversation
  app.post("/api/conversation/start", async (req, res) => {
    try {
      const { resumeId } = req.body;
      
      const conversation = await storage.createConversation({
        resumeId,
        messages: []
      });

      res.json(conversation);
    } catch (error) {
      console.error("Start conversation error:", error);
      res.status(500).json({ message: "Failed to start conversation: " + (error as any).message });
    }
  });

  // Get conversation messages
  app.get("/api/conversation/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getChatMessages(id);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to get messages: " + (error as any).message });
    }
  });

  // Send message
  app.post("/api/conversation/:id/message", async (req, res) => {
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

      // If it's a user message, generate AI response
      if (role === "user") {
        try {
          // Get conversation context
          const conversation = await storage.getConversation(id);
          const resume = conversation?.resumeId ? await storage.getResume(conversation.resumeId) : null;
          const resumeContext = resume?.parsedData || {};
          
          // Get recent messages for context
          const recentMessages = await storage.getMessagesByConversation(id);
          const messageHistory = recentMessages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }));

          // Use OpenAI for chat responses
          const aiResponse = await generateChatResponseWithOpenAI(messageHistory);

          // Save AI response
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
            error: "Failed to generate AI response: " + (aiError as any).message 
          });
        }
      } else {
        res.json({ message });
      }
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Failed to send message: " + (error as any).message });
    }
  });

  // Quick action responses
  app.post("/api/quick-action", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }

      // Use OpenAI for AI processing
      console.log("Processing query with OpenAI:", query);
      const response = await generateChatResponseWithOpenAI([{ role: "user", content: query }]);
      
      res.json({ 
        response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Quick action error:", error);
      res.status(500).json({ message: "Failed to process quick action: " + (error as any).message });
    }
  });

  // Get latest conversation
  app.get("/api/conversation/latest", async (req, res) => {
    try {
      const { resumeId } = req.query;
      const conversation = await storage.getLatestConversation(resumeId as string);
      
      if (!conversation) {
        return res.status(404).json({ message: "No conversation found" });
      }
      
      res.json(conversation);
    } catch (error) {
      console.error("Get latest conversation error:", error);
      res.status(500).json({ message: "Failed to get conversation: " + (error as any).message });
    }
  });

  // Get portfolio data
  app.get("/api/portfolio", async (req, res) => {
    try {
      res.json(portfolioData);
    } catch (error) {
      console.error("Get portfolio error:", error);
      res.status(500).json({ message: "Failed to get portfolio data: " + (error as any).message });
    }
  });

  // GitHub projects endpoint - fetches real data from GitHub API
  app.get("/api/github/projects", async (req, res) => {
    try {
      const githubUsername = "LakshmiSravya123";
      const githubApiUrl = `https://api.github.com/users/${githubUsername}/repos`;
      
      // Fetch real repositories from GitHub API
      const response = await fetch(`${githubApiUrl}?sort=updated&direction=desc&per_page=10`);
      
      if (!response.ok) {
        // Fallback to cached data if GitHub API fails
        console.log("GitHub API failed, using fallback data");
        const fallbackProjects = [
          {
            name: "AI-Policy-Pricing-Model",
            description: "Advanced machine learning model for automatic insurance policy pricing",
            language: "Python",
            stargazers_count: 18,
            html_url: "https://github.com/LakshmiSravya123/AI-Policy-Pricing-Model",
            updated_at: "2024-12-20T00:00:00Z"
          },
          {
            name: "React-Data-Science-Dashboard", 
            description: "Comprehensive data science dashboard built with React and Flask",
            language: "JavaScript",
            stargazers_count: 32,
            html_url: "https://github.com/LakshmiSravya123/React-Data-Science-Dashboard",
            updated_at: "2024-11-25T00:00:00Z"
          },
          {
            name: "Mobile-AI-Development",
            description: "iOS and Android applications using modern AI tools",
            language: "Swift", 
            stargazers_count: 14,
            html_url: "https://github.com/LakshmiSravya123/Mobile-AI-Development",
            updated_at: "2025-01-15T00:00:00Z"
          }
        ];
        
        const processedProjects = fallbackProjects.map(repo => ({
          name: repo.name,
          description: repo.description || "No description available",
          language: repo.language || "Unknown",
          stars: repo.stargazers_count,
          url: repo.html_url,
          updated_at: repo.updated_at
        }));
        
        return res.json(processedProjects);
      }

      const repos = await response.json();
      
      // Filter out forks and process repositories
      const processedProjects = repos
        .filter((repo: any) => !repo.fork && !repo.private)
        .map((repo: any) => ({
          name: repo.name,
          description: repo.description || "No description available",
          language: repo.language || "Unknown",
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          url: repo.html_url,
          updated_at: repo.updated_at,
          created_at: repo.created_at,
          topics: repo.topics || []
        }))
        .slice(0, 6); // Show latest 6 repositories
      
      res.json(processedProjects);
    } catch (error) {
      console.error("Get GitHub projects error:", error);
      
      // Return fallback data on any error
      const fallbackProjects = [
        {
          name: "AI-Policy-Pricing-Model",
          description: "Advanced machine learning model for automatic insurance policy pricing",
          language: "Python",
          stars: 18,
          forks: 4,
          url: "https://github.com/LakshmiSravya123/AI-Policy-Pricing-Model",
          updated_at: "2024-12-20T00:00:00Z"
        }
      ];
      
      res.json(fallbackProjects);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
