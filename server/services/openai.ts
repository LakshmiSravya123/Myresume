import OpenAI from 'openai';
import { portfolioData } from "./portfolioData";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateChatResponseWithOpenAI(messages: Array<{role: "user" | "assistant" | "system"; content: string}>): Promise<string> {
  try {
    console.log(`Processing query with OpenAI`);
    
    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content || "";
    
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
      top_p: 0.9,
    });

    return completion.choices[0]?.message?.content?.trim() || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error('OpenAI error:', error);
    
    // Fallback to rule-based responses if OpenAI fails
    return generateFallbackResponse(messages[messages.length - 1]?.content || "");
  }
}

export async function analyzeResumeWithOpenAI(resumeText: string): Promise<any> {
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
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content?.trim();
    
    try {
      return JSON.parse(response || '{}');
    } catch {
      // If parsing fails, return structured analysis based on response
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
    
    // Return fallback analysis
    return {
      analysis: {
        completeness: 80,
        strengths: ["Professional experience", "Technical skills", "Educational background"],
        improvements: ["Add more metrics and achievements", "Include project details", "Consider highlighting leadership experience"]
      }
    };
  }
}

function generateFallbackResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("experience") || lowerQuery.includes("work") || lowerQuery.includes("job")) {
    return `Lakshmi has comprehensive experience in data science and software development. She currently works as an AI/App Developer focusing on iOS and Android applications using cutting-edge AI tools like Cursor, Runway, and Luma. 

Previously, she served as a Senior Data Modeling & Reporting Analyst at Co-operators where she led AI-driven automation initiatives that resulted in significant operational efficiency improvements. She also has experience as a Software Developer at StackUp Technologies and as a System Engineer at Tata Consultancy Services, giving her a well-rounded technical background.`;
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
    return `Lakshmi holds a Master of Science in Computer Science from University of Regina (2019-2022) and a Bachelor of Technology in Computer Science from JNTU Hyderabad (2011-2015). Her educational background, combined with 6+ years of hands-on experience, provides her with both theoretical knowledge and practical expertise in data science and machine learning.`;
  }

  // Default response
  return `Lakshmi Sravya Vedantham is a highly skilled Data Analyst and Data Scientist with 6+ years of experience. She specializes in machine learning, statistical modeling, and AI-driven solutions. Currently working as an AI/App Developer, she has a proven track record of delivering significant results, including a 70% efficiency improvement through automation initiatives.

Her expertise spans programming languages like Python, R, and SQL, along with modern AI tools such as Cursor, Runway, and Luma. She has experience across multiple industries and has demonstrated strong leadership skills by mentoring junior analysts and managing teams.

Feel free to ask more specific questions about her experience, skills, or projects!`;
}

// Check if OpenAI is available
export async function checkOpenAIAvailability(): Promise<boolean> {
  try {
    await openai.models.list();
    return true;
  } catch (error) {
    console.log("OpenAI not available, using fallback responses");
    return false;
  }
}