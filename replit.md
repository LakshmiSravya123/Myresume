
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

### Analytics & Data Visualization
The portfolio features comprehensive analytics dashboards:

- **Grafana Analytics**: Embedded Grafana Cloud dashboard with public snapshot access for general portfolio analytics
- **Stock Market Dashboard**: Dedicated page (`/stocks`) with real-time Elasticsearch-powered stock analytics
  - **Dedicated Page**: Beautiful dark-themed standalone page with gradient backgrounds and animated elements
  - **Backend API**: Three Elasticsearch endpoints (/api/stocks/latest, /api/stocks/timeseries, /api/stocks/symbols)
  - **Visualizations**: Interactive Recharts components - OHLC charts, line charts, bar charts, scatter plots
  - **Real Data Only**: Displays actual Elasticsearch data with proper loading, error, and empty state handling
  - **Smart State Management**: Shows appropriate messages when Elasticsearch is unavailable or has no data
  - **Interactive Controls**: Stock symbol selector and time range controls for dynamic analysis
  - **Auto-refresh**: Data automatically updates every 30 seconds for real-time monitoring
- **Navigation**: 
  - Main navigation includes "Stock Dashboard" link routing to `/stocks`
  - Home page features gradient CTA section with "View Live Stock Dashboard" button
  - Stock page has "Back to Portfolio" link for easy navigation

### Authentication and File Handling
- **File Upload**: Secure file upload with validation for PDF, DOCX, and TXT formats
- **File Size Limits**: 10MB maximum file size to prevent abuse
- **Content Processing**: Text extraction and parsing from various resume formats

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL (via Neon serverless) with Drizzle ORM for type-safe database operations
- **AI Services**: Ollama for local LLM processing (no API keys required) with intelligent fallbacks
- **Analytics & Search**: Elasticsearch (@elastic/elasticsearch) for real-time stock market data analytics
- **Data Visualization**: Recharts library for interactive charts and graphs
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

## User Preferences

### About Me Section Content
**IMPORTANT: NEVER CHANGE THIS CONTENT - Even if resume is updated**

The "About Me" section (client/src/components/AboutSection.tsx) uses a cheerful, personal tone that reflects Lakshmi's personality:

- First paragraph: Introduction highlighting cheerful data scientist in San Jose, education, technical skills mix, and spiritual vibe
- Second paragraph: Career journey from Co-operators to current projects with a fun, adventurous tone
- Third paragraph: Personal interests (indoor plants, singing) and connection to spiritual purpose

This content is intentionally more casual and personal than the resume and should remain unchanged regardless of resume updates.
