
import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType, Option } from "../types";

export const aiService = {
  async reviewQuestion(question: Question): Promise<{ suggestion: string; difficulty: string }> {
    // Instantiate inside the call to ensure the latest selected API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Review this educational question for pedagogical clarity and accuracy. 
    Question: ${question.text}
    Type: ${question.type}
    ${question.options ? `Choices: ${question.options.map(o => o.text).join(', ')}` : ''}
    
    Return a brief suggestion and a difficulty level (Easy, Medium, Hard).`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestion: { type: Type.STRING },
              difficulty: { type: Type.STRING }
            },
            required: ["suggestion", "difficulty"]
          }
        }
      });
      
      const textResult = response.text?.trim() || "{}";
      return JSON.parse(textResult);
    } catch (error: any) {
      console.error("AI Review error:", error);
      if (error.message?.includes("API key not valid")) {
        throw new Error("API_KEY_INVALID");
      }
      return { suggestion: "Pedagogical review currently unavailable.", difficulty: "Medium" };
    }
  },

  async generateQuizFromTopic(topic: string, creatorId: string): Promise<any> {
    // Instantiate right before the call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Act as an expert curriculum designer. Create a high-quality assessment about: "${topic}".
    The assessment must have exactly 5 questions.
    Include a mix of MCQ and Short Answer.
    For MCQ, provide exactly 4 options.
    Include deep explanations for the correct answers.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    text: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    points: { type: Type.NUMBER },
                    options: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING },
                          isCorrect: { type: Type.BOOLEAN }
                        },
                        required: ["text", "isCorrect"]
                      }
                    }
                  },
                  required: ["type", "text", "points", "explanation"]
                }
              }
            },
            required: ["title", "description", "questions"]
          }
        }
      });

      const rawText = response.text?.trim() || "";
      const data = JSON.parse(rawText);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        title: data.title || topic,
        description: data.description || "AI-generated study resource.",
        creatorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        themeColor: '#6366f1',
        settings: {
          isReleased: true,
          requireConfidence: true,
          shuffleQuestions: false,
          overallTimer: 0
        },
        questions: (data.questions || []).map((q: any) => ({
          ...q,
          id: Math.random().toString(36).substr(2, 9),
          type: q.type === 'mcq' ? 'mcq' : 'short_answer',
          options: q.options?.map((o: any) => ({
            ...o,
            id: Math.random().toString(36).substr(2, 9)
          }))
        }))
      };
    } catch (error: any) {
      console.error("AI Generation error:", error);
      if (error.message?.includes("API key not valid") || error.message?.includes("Key not found")) {
        throw new Error("API_KEY_INVALID");
      }
      throw new Error("Our AI teacher is taking a break. Please try a more specific topic.");
    }
  }
};
