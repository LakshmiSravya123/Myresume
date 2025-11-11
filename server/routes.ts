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

  // Download resume endpoint
  app.get("/api/resume/download", async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Use the most recent resume file
      const resumePath = path.resolve(import.meta.dirname, '../attached_assets/Sravya 2025 Resume October_1759863399934.pdf');
      
      // Check if file exists
      try {
        await fs.access(resumePath);
      } catch {
        return res.status(404).json({ message: "Resume file not found" });
      }
      
      // Set headers for file download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Lakshmi_Sravya_Vedantham_Resume.pdf"');
      
      // Stream the file
      const fileBuffer = await fs.readFile(resumePath);
      res.send(fileBuffer);
    } catch (error) {
      console.error("Resume download error:", error);
      res.status(500).json({ message: "Failed to download resume: " + (error as any).message });
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
            name: "Myresume",
            description: "This is a personal portfolio website that showcases professional experience, technical skills, projects, and provides an AI-powered chat assistant to answer questions about the resume and career background.",
            language: "TypeScript",
            stargazers_count: 0,
            html_url: "https://github.com/LakshmiSravya123/Myresume",
            updated_at: "2025-11-10T20:48:52Z",
            topics: ["portfolio", "react", "typescript", "ai-assistant"]
          },
          {
            name: "DreamAnalysis",
            description: "Neural Dream Workshop is an innovative AI-powered system that integrates Brain-Computer Interface (BCI) technology with advanced machine learning to capture, analyze, and enhance dream experiences.",
            language: "TypeScript",
            stargazers_count: 0,
            html_url: "https://github.com/LakshmiSravya123/DreamAnalysis",
            updated_at: "2025-11-06T23:31:53Z",
            topics: ["ai", "machine-learning", "bci", "dream-analysis"]
          },
          {
            name: "promptforge",
            description: "Generate production-ready full-stack applications in 60 seconds from a single prompt.",
            language: "Python",
            stargazers_count: 0,
            html_url: "https://github.com/LakshmiSravya123/promptforge",
            updated_at: "2025-11-05T20:16:21Z",
            topics: ["ai", "code-generation", "automation"]
          },
          {
            name: "uniforge",
            description: "Automate repetitive desktop workflows by capturing keyboard patterns and replaying them through a unified desktop experience. UniForge ships as a three-service MVP: a Flask API for todo-like data, a keystroke recorder bridge, and a Vite/Electron frontend that orchestrates automation flows.",
            language: "Python",
            stargazers_count: 0,
            html_url: "https://github.com/LakshmiSravya123/uniforge",
            updated_at: "2025-11-05T02:38:46Z",
            topics: ["automation", "desktop-app", "electron"]
          },
          {
            name: "Harmony",
            description: "A Flutter-based spiritual journaling app that combines AI-powered insights, nature scanning, and health data integration to help users reflect, find purpose, and calm their minds.",
            language: "Dart",
            stargazers_count: 0,
            html_url: "https://github.com/LakshmiSravya123/Harmony",
            updated_at: "2025-10-21T21:21:56Z",
            topics: ["flutter", "mobile-app", "ai", "wellness"]
          },
          {
            name: "airflow",
            description: "A complete ETL (Extract, Transform, Load) pipeline for processing autonomous vehicle telemetry data using Apache Airflow, with optional streaming capabilities using Kafka and Spark.",
            language: "Python",
            stargazers_count: 0,
            html_url: "https://github.com/LakshmiSravya123/airflow",
            updated_at: "2025-10-16T20:43:41Z",
            topics: ["airflow", "etl", "data-engineering", "kafka"]
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
      
      // Return fallback data on any error (updated with actual current repos)
      const fallbackProjects = [
        {
          name: "Myresume",
          description: "This is a personal portfolio website that showcases professional experience, technical skills, projects, and provides an AI-powered chat assistant to answer questions about the resume and career background.",
          language: "TypeScript",
          stars: 0,
          forks: 0,
          url: "https://github.com/LakshmiSravya123/Myresume",
          updated_at: "2025-11-10T20:48:52Z",
          topics: ["portfolio", "react", "typescript", "ai-assistant"]
        },
        {
          name: "DreamAnalysis",
          description: "Neural Dream Workshop is an innovative AI-powered system that integrates Brain-Computer Interface (BCI) technology with advanced machine learning to capture, analyze, and enhance dream experiences.",
          language: "TypeScript",
          stars: 0,
          forks: 0,
          url: "https://github.com/LakshmiSravya123/DreamAnalysis",
          updated_at: "2025-11-06T23:31:53Z",
          topics: ["ai", "machine-learning", "bci", "dream-analysis"]
        },
        {
          name: "promptforge",
          description: "Generate production-ready full-stack applications in 60 seconds from a single prompt.",
          language: "Python",
          stars: 0,
          forks: 0,
          url: "https://github.com/LakshmiSravya123/promptforge",
          updated_at: "2025-11-05T20:16:21Z",
          topics: ["ai", "code-generation", "automation"]
        },
        {
          name: "uniforge",
          description: "Automate repetitive desktop workflows by capturing keyboard patterns and replaying them through a unified desktop experience.",
          language: "Python",
          stars: 0,
          forks: 0,
          url: "https://github.com/LakshmiSravya123/uniforge",
          updated_at: "2025-11-05T02:38:46Z",
          topics: ["automation", "desktop-app", "electron"]
        },
        {
          name: "Harmony",
          description: "A Flutter-based spiritual journaling app that combines AI-powered insights, nature scanning, and health data integration to help users reflect, find purpose, and calm their minds.",
          language: "Dart",
          stars: 0,
          forks: 0,
          url: "https://github.com/LakshmiSravya123/Harmony",
          updated_at: "2025-10-21T21:21:56Z",
          topics: ["flutter", "mobile-app", "ai", "wellness"]
        },
        {
          name: "airflow",
          description: "A complete ETL pipeline for processing autonomous vehicle telemetry data using Apache Airflow, with streaming capabilities using Kafka and Spark.",
          language: "Python",
          stars: 0,
          forks: 0,
          url: "https://github.com/LakshmiSravya123/airflow",
          updated_at: "2025-10-16T20:43:41Z",
          topics: ["airflow", "etl", "data-engineering", "kafka"]
        }
      ];
      
      res.json(fallbackProjects);
    }
  });

  // Helper function to generate fallback stock data
  const generateFallbackStockData = () => {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD', 'NFLX', 'DIS'];
    const baseData: any = {
      'AAPL': { price: 178.45, open: 177.20, high: 179.80, low: 176.90, volume: 58234567, change: 1.25 },
      'GOOGL': { price: 142.30, open: 141.50, high: 143.20, low: 140.80, volume: 32456789, change: 0.80 },
      'MSFT': { price: 380.25, open: 378.90, high: 382.10, low: 377.50, volume: 28901234, change: 1.35 },
      'AMZN': { price: 165.80, open: 164.30, high: 167.20, low: 163.90, volume: 45678901, change: 1.50 },
      'META': { price: 485.60, open: 483.20, high: 488.40, low: 482.10, volume: 19876543, change: 2.40 },
      'TSLA': { price: 242.15, open: 240.80, high: 244.50, low: 239.60, volume: 89012345, change: 1.35 },
      'NVDA': { price: 495.30, open: 492.40, high: 498.90, low: 491.20, volume: 41234567, change: 2.90 },
      'AMD': { price: 163.75, open: 162.30, high: 165.40, low: 161.80, volume: 37890123, change: 1.45 },
      'NFLX': { price: 598.90, open: 595.20, high: 602.30, low: 594.10, volume: 14567890, change: 3.70 },
      'DIS': { price: 110.35, open: 109.50, high: 111.80, low: 108.90, volume: 21345678, change: 0.85 }
    };

    return symbols.map(symbol => ({
      "@timestamp": new Date().toISOString(),
      symbol,
      close: baseData[symbol].price,
      open: baseData[symbol].open,
      high: baseData[symbol].high,
      low: baseData[symbol].low,
      volume: baseData[symbol].volume
    }));
  };

  // Elasticsearch Stock Data endpoints
  app.get("/api/stocks/latest", async (req, res) => {
    try {
      const { Client } = await import('@elastic/elasticsearch');
      
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

      const index = process.env.ELASTIC_INDEX || 'stocks_real_time';
      const size = parseInt(req.query.size as string) || 50;
      
      // Test connection
      const pingResult = await es.ping();
      console.log('Elasticsearch ping successful:', pingResult);

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

      const buckets = (response.aggregations as any).by_symbol.buckets;
      const data = buckets.map((bucket: any) => bucket.latest_doc.hits.hits[0]._source);
      
      res.json(data);
    } catch (error: any) {
      console.error("Elasticsearch latest error:", error);
      console.log("Using fallback stock data due to Elasticsearch error");
      res.json(generateFallbackStockData());
    }
  });

  app.get("/api/stocks/timeseries", async (req, res) => {
    try {
      const { Client } = await import('@elastic/elasticsearch');
      
      const cloudId = process.env.ES_CLOUD_ID;
      const username = process.env.ELASTICSEARCH_USERNAME;
      const password = process.env.ELASTICSEARCH_PASSWORD;
      
      if (!cloudId || !username || !password) {
        console.log("Elasticsearch credentials not configured, using fallback timeseries data");
        const symbols = (req.query.symbols as string)?.split(',') || ['AAPL', 'GOOGL', 'MSFT'];
        const fallbackData = generateFallbackStockData();
        const filteredData = fallbackData.filter(d => symbols.includes(d.symbol));
        return res.json(filteredData.length > 0 ? filteredData : fallbackData.slice(0, 3));
      }
      
      const es = new Client({
        cloud: { id: cloudId },
        auth: { username, password }
      });

      const index = process.env.ELASTIC_INDEX || 'stocks_real_time';
      const symbols = (req.query.symbols as string)?.split(',') || [];
      const hours = parseInt(req.query.hours as string) || 24;

      // Query all data for the selected symbols (don't restrict by time since markets are closed)
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
        size: 1000
      });

      const data = response.hits.hits.map((hit: any) => hit._source);
      res.json(data);
    } catch (error: any) {
      console.error("Elasticsearch timeseries error:", error);
      console.log("Using fallback timeseries data due to Elasticsearch error");
      const symbols = (req.query.symbols as string)?.split(',') || ['AAPL', 'GOOGL', 'MSFT'];
      const fallbackData = generateFallbackStockData();
      const filteredData = fallbackData.filter(d => symbols.includes(d.symbol));
      res.json(filteredData.length > 0 ? filteredData : fallbackData.slice(0, 3));
    }
  });

  app.get("/api/stocks/symbols", async (req, res) => {
    try {
      const { Client } = await import('@elastic/elasticsearch');
      
      const cloudId = process.env.ES_CLOUD_ID;
      const username = process.env.ELASTICSEARCH_USERNAME;
      const password = process.env.ELASTICSEARCH_PASSWORD;
      
      if (!cloudId || !username || !password) {
        console.log("Elasticsearch credentials not configured, using fallback symbols");
        return res.json(['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD', 'NFLX', 'DIS']);
      }
      
      const es = new Client({
        cloud: { id: cloudId },
        auth: { username, password }
      });

      const index = process.env.ELASTIC_INDEX || 'stocks_real_time';

      const response = await es.search({
        index,
        aggs: {
          symbols: {
            terms: { field: "symbol", size: 1000 }
          }
        },
        size: 0
      });

      const symbols = (response.aggregations as any).symbols.buckets.map((b: any) => b.key);
      res.json(symbols);
    } catch (error: any) {
      console.error("Elasticsearch symbols error:", error);
      console.log("Using fallback symbols due to Elasticsearch error");
      res.json(['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD', 'NFLX', 'DIS']);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
