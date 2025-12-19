import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getHealthAdvice = async (userQuery: string): Promise<string> => {
  if (!apiKey) {
    return "AI Assistant is currently offline (API Key missing). Please contact support.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful and knowledgeable medical assistant for 'HemoCare Hub BD', a blood donation platform in Bangladesh. 
      Answer the user's question politely and concisely. 
      Focus on blood donation eligibility, health tips, and general medical guidance. 
      If the query is an emergency, advise them to call 999 immediately.
      
      User Query: ${userQuery}`,
    });

    return response.text || "I'm sorry, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server. Please try again later.";
  }
};
