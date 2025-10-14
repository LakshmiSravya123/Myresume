
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

### Design & Visual Identity

**Professional & Cheerful Color Palette**
The website uses a clean, professional color scheme with cheerful touches:

- **Primary Color**: Royal Blue (hsl(221, 83%, 53%)) - professional and trustworthy
- **Secondary Color**: Purple (hsl(262, 52%, 47%)) - adds cheerful personality
- **Background**: Clean white and light gray (hsl(210, 40%, 96.1%))
- **Typography**: Poppins font for a friendly, approachable feel
- **Design Philosophy**: Uniform, clean, professional with minimal decorative elements

**Color Usage Across Pages:**
- Navigation: Clean white background with blue accents
- Home page: Gray-50 background for content, white sections
- About section: White background with clean layout
- AI Assistant: Blue (user) and purple (bot) chat bubbles on clean gray background
- Stock Dashboard: Blue-to-purple gradient for visual interest while maintaining data readability
- Project buttons: Purple and blue solid colors (no gradients)

**Design Principles**:
- Clean, uniform backgrounds (no excessive gradients or patterns)
- Professional color palette with blue as primary
- Cheerful without being overwhelming
- Consistent spacing and typography

### About Me Section Content
**IMPORTANT: This content was last updated October 2025**

The "About Me" section (client/src/components/AboutSection.tsx) uses a cheerful, personal tone that reflects Lakshmi's personality:

Current text (October 2025):
- First paragraph: "Hiya! I'm a super cheery data scientist, turning data into pure joy with my Master's in Data Analytics and a sprinkle of Machine Learning. I love creating cool models and dazzling dashboards, and my happy heart makes every project—whether it's cracking brain waves or boosting systems—a fun, clear adventure!"
- Second paragraph: "My career's like a secret, grin-filled party! I've spiced up systems, built chatty bots, and whipped up real-time trackers. I get a kick out of sparking apps, smoothing data flows, and cheering teams to make data shine—each job's a delightful puzzle!"
- Third paragraph: Personal interests with "leafy buddies" (indoor plants) and singing soulful tunes - creating solutions that spread big smiles and good vibes

This content is intentionally more casual and personal than the resume.

### Featured Projects Layout
The Featured Projects section displays 3 clickable image cards in a responsive grid:
1. **AI Video Generator** - External link to video-ai-beryl.vercel.app
2. **Grafana Analytics Dashboard** - External link to Grafana Cloud dashboard
3. **Tesla Sales Dashboard** - External link to tesla-sales-dashboard.vercel.app
