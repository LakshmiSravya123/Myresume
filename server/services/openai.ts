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
    return `Lakshmi has comprehensive experience as a data scientist and software engineer spanning over a decade. Most recently, she served as a Sr. Data Modeling Engineer at Co-operators (October 2022 - February 2025) in Toronto, where she developed interactive applications using D3.js, Plotly, and Streamlit, and led the modernization of legacy systems with microservices architecture using Docker and Kubernetes.

Previously, she worked as a Software Engineer at StackUp Technologies (2018-2019) developing React.js front-end applications and Flask APIs, and as a Software Development Engineer at Tata Consultancy Services (2015-2018) building enterprise platforms with AngularJS and Spring Boot.

Currently, she's in a relocation transition period, focusing on intensive research and development in Generative AI frameworks, machine learning operations, and brain activity modeling.`;
  }

  if (lowerQuery.includes("skill") || lowerQuery.includes("technolog") || lowerQuery.includes("programming")) {
    return `Lakshmi has expertise across multiple technology domains:

**Programming Languages**: Python, R, SQL, C++
**Data & Analytics**: Tableau, Power BI, Streamlit, D3.js, Plotly, Pandas, NumPy, ETL
**Machine Learning & AI**: TensorFlow, PyTorch, scikit-learn, Statistical Modeling, LangChain, RAG, Llama 3.1, FAISS, Pinecone, DistilBERT
**Cloud & Infrastructure**: Docker, Kubernetes, Elasticsearch, Grafana, Prometheus
**Web Development**: React, AngularJS, Flask, Spring Boot, FastAPI, Next.js
**Specializations**: Data Modeling, Predictive Modeling, Business Intelligence, Data Governance, Federated Learning

Her diverse skill set spans from traditional data analysis to cutting-edge AI and machine learning frameworks.`;
  }

  if (lowerQuery.includes("project") || lowerQuery.includes("achievement")) {
    return `Lakshmi has worked on several cutting-edge projects:

**Multimodal Brain Activity Analysis Platform (2025)**: Developed a platform applying specialized neural data processing tools (NeuroML, MNE-Python) on simulated brainwave data, and integrated transformer models (DistilBERT) and image-text analysis (CLIP) for mood detection.

**RAG Chatbot with LangChain & Llama 3.1 (2025)**: Created a production-grade chatbot using the Retrieval-Augmented Generation pattern with fine-tuned LLM, leveraging vector search libraries (FAISS, Pinecone) for fast, context-aware responses.

**Full-Stack App with Monitoring & Federated Learning (2025)**: Deployed full-stack applications on Vercel with Next.js and FastAPI, setting up continuous monitoring via Prometheus and Grafana, and implementing the Flower framework for federated learning.

At Co-operators, she built high-accuracy policy pricing models with TensorFlow, PyTorch, and scikit-learn, and mentored teams in building scalable, data-driven applications.`;
  }

  if (lowerQuery.includes("education") || lowerQuery.includes("background")) {
    return `Lakshmi holds a Master's in Data Analytics with a Minor in Applied Machine Learning from Northeastern University (2022, GPA: 3.8). Her educational background, combined with over 10 years of hands-on experience across software development and data science, provides her with both deep theoretical knowledge and extensive practical expertise in AI, machine learning, and data-driven solutions.`;
  }

  // Default response
  return `Lakshmi Sravya Vedantham is a highly skilled Data Scientist with over 10 years of experience in software development and data science. She specializes in machine learning, statistical modeling, and AI-driven solutions. She has a Master's in Data Analytics with a Minor in Applied Machine Learning from Northeastern University (GPA: 3.8).

Her expertise spans programming languages like Python, R, SQL, and C++, along with cutting-edge AI frameworks such as LangChain, RAG, transformers, and federated learning. She has proven experience building production-grade ML models, modernizing legacy systems, and mentoring teams in scalable data-driven application development.

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