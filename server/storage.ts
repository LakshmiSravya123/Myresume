import { type Resume, type InsertResume, type Conversation, type InsertConversation, type Message, type InsertMessage, type ChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Resume operations
  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: string): Promise<Resume | undefined>;
  getLatestResume(): Promise<Resume | undefined>;
  updateResumeParsedData(id: string, parsedData: any): Promise<Resume>;
  
  // Conversation operations
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getLatestConversation(resumeId?: string): Promise<Conversation | undefined>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  getChatMessages(conversationId: string): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private resumes: Map<string, Resume>;
  private conversations: Map<string, Conversation>;
  private messages: Map<string, Message>;

  constructor() {
    this.resumes = new Map();
    this.conversations = new Map();
    this.messages = new Map();
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const resume: Resume = {
      id,
      filename: insertResume.filename,
      content: insertResume.content,
      parsedData: insertResume.parsedData || {},
      uploadedAt: new Date(),
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getLatestResume(): Promise<Resume | undefined> {
    const resumeArray = Array.from(this.resumes.values());
    return resumeArray.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];
  }

  async updateResumeParsedData(id: string, parsedData: any): Promise<Resume> {
    const resume = this.resumes.get(id);
    if (!resume) {
      throw new Error("Resume not found");
    }
    const updatedResume = { ...resume, parsedData };
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const now = new Date();
    const conversation: Conversation = {
      id,
      resumeId: insertConversation.resumeId || null,
      messages: insertConversation.messages || [],
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getLatestConversation(resumeId?: string): Promise<Conversation | undefined> {
    const conversationArray = Array.from(this.conversations.values());
    const filtered = resumeId 
      ? conversationArray.filter(c => c.resumeId === resumeId)
      : conversationArray;
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async getChatMessages(conversationId: string): Promise<ChatMessage[]> {
    const messages = await this.getMessagesByConversation(conversationId);
    return messages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
    }));
  }
}

export const storage = new MemStorage();
