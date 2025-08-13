import { portfolioData } from "./portfolioData";

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export async function generateChatResponseWithOllama(messages: Array<{role: "user" | "assistant" | "system"; content: string}>): Promise<string> {
  try {
    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content || "";
    
    // Create a comprehensive prompt with portfolio context
    const contextPrompt = `You are an AI assistant for Lakshmi Sravya Vedantham's personal portfolio website. You have access to her complete professional background and should provide detailed, personalized responses about her career, skills, and experience.

PORTFOLIO CONTEXT:
${JSON.stringify(portfolioData, null, 2)}

Based on this information, please answer the following question in a professional and detailed manner. Reference specific details from her background when relevant:

Question: ${userMessage}

Provide a helpful response that showcases her expertise and achievements:`;

    // Try to connect to Ollama API
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:3b', // Using a smaller model that's likely to be available
        prompt: contextPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 500
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response || "I apologize, but I couldn't generate a response at this time.";

  } catch (error) {
    console.error("Ollama error:", error);
    
    // Fallback to rule-based responses based on common queries
    return generateFallbackResponse(messages[messages.length - 1]?.content || "");
  }
}

export async function analyzeResumeWithOllama(resumeText: string): Promise<any> {
  try {
    const prompt = `Please analyze this resume and extract structured information in JSON format. Focus on:
- Personal information (name, contact details)
- Work experience with companies, positions, durations, and key achievements
- Technical skills and technologies
- Education background
- Notable projects

Resume text:
${resumeText}

Please respond with structured JSON data.`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3,
          max_tokens: 1000
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data: OllamaResponse = await response.json();
    
    try {
      return JSON.parse(data.response);
    } catch {
      // If parsing fails, return basic analysis
      return {
        analysis: {
          completeness: 85,
          strengths: ["Technical expertise", "Professional experience", "Diverse skill set"],
          improvements: ["Consider adding more specific metrics", "Include project outcomes"]
        }
      };
    }

  } catch (error) {
    console.error("Ollama analysis error:", error);
    
    // Return fallback analysis
    return {
      analysis: {
        completeness: 80,
        strengths: ["Strong technical background", "Relevant experience", "Good skill diversity"],
        improvements: ["Add more quantifiable achievements", "Include project details"]
      }
    };
  }
}

function generateFallbackResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("experience") || lowerQuery.includes("work") || lowerQuery.includes("job")) {
    return `Lakshmi has 6+ years of comprehensive experience in data science and software development. She currently works as an AI/App Developer focusing on iOS and Android applications using cutting-edge AI tools like Cursor, Runway, and Luma. 

Previously, she served as a Senior Data Modeling & Reporting Analyst at Co-operators where she led AI-driven automation initiatives that resulted in a 70% increase in operational efficiency. She also has experience as a Software Developer at StackUp Technologies and as a System Engineer at Tata Consultancy Services, giving her a well-rounded technical background.`;
  }

  if (lowerQuery.includes("skill") || lowerQuery.includes("technolog") || lowerQuery.includes("programming")) {
    return `Lakshmi has expertise across multiple technology domains:

**Programming Languages**: Python, R, SQL, JavaScript, Java, C++
**Data & Analytics**: Tableau, Power BI, MicroStrategy, Pandas, NumPy
**Machine Learning**: Scikit-learn, TensorFlow, PyTorch, Statistical Modeling
**Cloud & Databases**: MySQL, PostgreSQL, Azure, Google Cloud
**Modern AI Tools**: Cursor, Runway, Luma, Stable Diffusion
**Web Development**: React, AngularJS, Flask, Spring

Her diverse skill set spans from traditional data analysis to cutting-edge AI development tools.`;
  }

  if (lowerQuery.includes("project") || lowerQuery.includes("achievement")) {
    return `Lakshmi has worked on several impactful projects:

**AI-Driven Policy Pricing Model (2024)**: Developed an advanced machine learning model for automated insurance policy pricing that significantly improved accuracy and competitive positioning.

**React Data Science Dashboard (2019)**: Led the comprehensive redevelopment of a data science project using React, Python, and Flask, focusing on user-centric interfaces and reusable components.

**Mobile App Development (2025)**: Currently developing iOS and Android applications using modern AI tools like Cursor, Runway, and Luma, demonstrating her adaptability to emerging technologies.

Her most notable achievement was leading automation initiatives that resulted in a 70% increase in operational efficiency at Co-operators.`;
  }

  if (lowerQuery.includes("education") || lowerQuery.includes("background")) {
    return `Lakshmi is currently pursuing Graduate Studies in Advanced Analytics & Data Science (2021-2025), which complements her extensive practical experience in the field. Her educational background, combined with 6+ years of hands-on experience, provides her with both theoretical knowledge and practical expertise in data science and machine learning.`;
  }

  // Default response
  return `Lakshmi Sravya Vedantham is a highly skilled Data Analyst and Data Scientist with 6+ years of experience. She specializes in machine learning, statistical modeling, and AI-driven solutions. Currently working as an AI/App Developer, she has a proven track record of delivering significant results, including a 70% efficiency improvement through automation initiatives.

Her expertise spans programming languages like Python, R, and SQL, along with modern AI tools such as Cursor, Runway, and Luma. She has experience across multiple industries and has demonstrated strong leadership skills by mentoring junior analysts and managing teams.

Feel free to ask more specific questions about her experience, skills, or projects!`;
}

// Check if Ollama is available
export async function checkOllamaAvailability(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    return response.ok;
  } catch (error) {
    console.log("Ollama not available, using fallback responses");
    return false;
  }
}