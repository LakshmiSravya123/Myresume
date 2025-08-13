import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function generateChatResponse(messages: Array<{role: "user" | "assistant" | "system"; content: string}>, resumeContext: any): Promise<string> {
  try {
    const systemPrompt = `You are an AI assistant for Lakshmi Sravya Vedantham's personal portfolio website. You have access to her complete resume and professional background. Here is her data:

${JSON.stringify(resumeContext, null, 2)}

Provide detailed, personalized responses about Lakshmi's background, experience, skills, and career journey. Be specific and reference actual details from her resume. Help visitors understand her expertise in data science, machine learning, and software development. Highlight her achievements like the 70% efficiency improvement and her diverse technical skills.

Always respond in a professional yet approachable tone that reflects her expertise and passion for data-driven solutions.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response: " + (error as any).message);
  }
}

export async function analyzeResume(resumeContent: string): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyzer. Parse the resume content and extract structured information. Return your analysis in JSON format with the following structure: { personalInfo: {name, title, email, phone, location}, workExperience: [{company, position, duration, description, technologies}], projects: [{name, description, technologies, year}], skills: [string array], education: [{institution, degree, year}], analysis: {completeness: number(0-100), strengths: [string], improvements: [string]} }"
        },
        {
          role: "user",
          content: `Please analyze this resume and extract structured information:\n\n${resumeContent}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Resume analysis error:", error);
    throw new Error("Failed to analyze resume: " + (error as any).message);
  }
}

export async function generateQuickResponse(query: string, resumeContext: any): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI career assistant. Answer the user's query about their career using their resume information: ${JSON.stringify(resumeContext)}. Keep responses concise but informative.`
        },
        {
          role: "user",
          content: query
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I couldn't process that query. Please try rephrasing.";
  } catch (error) {
    console.error("Quick response error:", error);
    throw new Error("Failed to generate response: " + (error as any).message);
  }
}
