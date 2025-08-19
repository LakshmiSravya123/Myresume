# Lakshmi Sravya Vedantham - Personal Portfolio

## Overview

This is a personal portfolio website for Lakshmi Sravya Vedantham, a Data Analyst and Data Scientist with 6+ years of experience. The website showcases professional experience, technical skills, projects, and provides an AI-powered chat assistant to answer questions about the resume and career background. The design is inspired by skirano.com with modern animations and professional aesthetics to stand out among employers.

## User Preferences

- Personal website focused on individual portfolio (not generic career assistant)
- Modern, professional design that stands out to employers
- Inspired by skirano.com aesthetics with professional typography using Inter font
- Include animations and appealing visuals
- Real GitHub integration to show live projects from https://github.com/LakshmiSravya123/
- AI questionnaire section instead of chat icons for resume Q&A functionality
- Remove featured projects section, keep only GitHub projects section
- Local AI processing using Ollama or Hugging Face transformers (no API keys required)
- Professional fonts throughout the application (Inter + JetBrains Mono)
- Custom logo and branding

## System Architecture

### Frontend Architecture
The client-side is built using **React 18** with **TypeScript** and follows a modern component-based architecture:

- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **UI Framework**: shadcn/ui components built on top of Radix UI primitives with Tailwind CSS for styling
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

The application features a responsive design with a sidebar-based layout that adapts to mobile screens using a drawer pattern.

### Backend Architecture
The server is built with **Express.js** and follows RESTful API principles:

- **Runtime**: Node.js with TypeScript and ES modules
- **API Structure**: Express routes with proper error handling and request logging
- **File Upload**: Multer middleware for handling resume file uploads with size and type validation
- **Development**: Hot reloading with Vite integration in development mode

### Data Storage Solutions
The application uses a hybrid storage approach:

- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Well-defined tables for resumes, conversations, and messages with proper relationships
- **Development Storage**: In-memory storage implementation for development/testing
- **Migration**: Drizzle Kit for database schema management and migrations

### AI Integration
Local AI processing using Ollama for privacy-focused intelligent responses:

- **Ollama Integration**: Local LLM processing using models like llama3.2:3b for resume Q&A
- **Intelligent Fallbacks**: Smart rule-based responses when Ollama is not available
- **Privacy-First**: No external API calls required - all processing happens locally
- **Conversational AI**: Context-aware responses about Lakshmi's experience, skills, and projects
- **No API Keys**: Completely self-contained solution without external dependencies

### Authentication and File Handling
- **File Upload**: Secure file upload with validation for PDF, DOCX, and TXT formats
- **File Size Limits**: 10MB maximum file size to prevent abuse
- **Content Processing**: Text extraction and parsing from various resume formats

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL (via Neon serverless) with Drizzle ORM for type-safe database operations
- **AI Services**: Ollama for local LLM processing (no API keys required) with intelligent fallbacks
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS for utility-first styling with custom design tokens

### Development Dependencies
- **Build Tools**: Vite for fast development and production builds, esbuild for server bundling
- **Type Safety**: TypeScript across the entire stack with strict configuration
- **Development Experience**: Replit-specific plugins for enhanced development workflow

### File Processing
- **Multer**: Server-side file upload handling with memory storage
- **Text Processing**: Custom resume parsing logic for extracting structured information

### Additional Integrations
- **Date Handling**: date-fns for consistent date manipulation
- **Form Validation**: Zod for runtime type validation and schema definition
- **Component Variants**: class-variance-authority for type-safe component styling variants