import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertResumeSchema, insertMessageSchema } from "@shared/schema";
import { generateChatResponse, analyzeResume, generateQuickResponse } from "./services/openai";
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
        const aiAnalysis = await analyzeResume(content);
        
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

          const aiResponse = await generateChatResponse(messageHistory, resumeContext);

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

      const resume = await storage.getLatestResume();
      const resumeContext = resume?.parsedData || {};
      
      const response = await generateQuickResponse(query, resumeContext);
      
      res.json({ response });
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

  // GitHub projects endpoint (mock for now)
  app.get("/api/github/projects", async (req, res) => {
    try {
      // Mock GitHub projects - in a real implementation, you'd use GitHub API
      const projects = [
        {
          name: "AI-Policy-Pricing",
          description: "Machine learning model for automated insurance policy pricing",
          language: "Python",
          stars: 15,
          url: "https://github.com/lakshmisravya/ai-policy-pricing",
          updated_at: "2024-12-15"
        },
        {
          name: "Data-Science-Dashboard",
          description: "React-based dashboard for data visualization and analytics",
          language: "JavaScript",
          stars: 8,
          url: "https://github.com/lakshmisravya/data-dashboard",
          updated_at: "2024-11-20"
        },
        {
          name: "Mobile-App-Suite",
          description: "Cross-platform mobile applications using modern AI tools",
          language: "Swift",
          stars: 12,
          url: "https://github.com/lakshmisravya/mobile-app-suite",
          updated_at: "2025-01-10"
        }
      ];
      
      res.json(projects);
    } catch (error) {
      console.error("Get GitHub projects error:", error);
      res.status(500).json({ message: "Failed to get GitHub projects: " + (error as any).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
