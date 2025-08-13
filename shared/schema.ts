import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  content: text("content").notNull(),
  parsedData: json("parsed_data").notNull().default({}),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resumeId: varchar("resume_id").references(() => resumes.id),
  messages: json("messages").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id).notNull(),
  role: varchar("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  uploadedAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Additional types for frontend
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type PersonalInfo = {
  name: string;
  title?: string;
  email: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  location?: string;
};

export type WorkExperience = {
  company: string;
  position: string;
  duration: string;
  location?: string;
  description: string[];
  technologies: string[];
};

export type Project = {
  name: string;
  description: string;
  technologies: string[];
  year?: string;
  github?: string;
  demo?: string;
};

export type Education = {
  institution: string;
  degree: string;
  year: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  projects: Project[];
  skills: string[];
  education: Education[];
  analysis?: {
    completeness: number;
    strengths: string[];
    improvements: string[];
  };
};
