
import { GoogleGenAI, Type } from "@google/genai";
import { ComplaintAnalysis } from "../types";

export const analyzeComplaint = async (description: string, imageUrl?: string, context?: string): Promise<ComplaintAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an intelligent processing layer for the Indian Postal Service. 
    Role: Analyze incoming grievances to assist staff in faster resolution.
    
    CRITICAL RULES:
    1. Multilingual: If input is Hindi, Hinglish, or regional, normalize it to clear English in 'translatedText'.
    2. Classification: Categorize into: Delivery Delay, Lost Parcel, Damaged Item, Wrong Delivery, Staff Misconduct, Refund/Payment Issue, or Other.
    3. Sentiment: Detect 'Positive', 'Neutral', 'Frustrated', or 'Angry'.
    4. Priority: Assign 'Low', 'Medium', 'High', or 'Urgent' based on severity and keywords (e.g. passport, medicine, pension).
    5. Entities: Extract tracking numbers (e.g. EB123456789IN), 6-digit PIN codes, and city/office names.
    6. Routing: Based on PIN or Office, suggest a 'routingOffice'.
    7. Draft Response: Create a FORMAL, GOVERNMENT-SAFE response. Acknowledge the issue, state that it is under review. Do NOT make promises or admit fault.
    8. Duplicates: Use the provided context to check if this seems like a duplicate of previous reports.
    
    Return structured JSON.
  `;

  const parts: any[] = [
    { text: `Current Context (Previous Complaints): ${context || "None"}` },
    { text: `User Input: ${description}` }
  ];
  
  if (imageUrl) {
    parts.push({
      inlineData: { mimeType: 'image/jpeg', data: imageUrl.split(',')[1] }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            sentiment: { type: Type.STRING },
            priority: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedResponse: { type: Type.STRING },
            summary: { type: Type.STRING },
            translatedText: { type: Type.STRING },
            isPotentialDuplicate: { type: Type.BOOLEAN },
            duplicateConfidence: { type: Type.NUMBER },
            routingOffice: { type: Type.STRING },
            entities: {
              type: Type.OBJECT,
              properties: {
                location: { type: Type.STRING },
                post_office: { type: Type.STRING },
                tracking_number: { type: Type.STRING },
                pin_code: { type: Type.STRING }
              }
            }
          },
          required: ["category", "sentiment", "priority", "tags", "suggestedResponse", "summary", "translatedText", "entities", "routingOffice"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Smart processing failed:", error);
    return {
      category: "Other",
      sentiment: "Neutral",
      priority: "Medium",
      tags: ["manual-triage"],
      suggestedResponse: "Grievance received. Under manual review.",
      summary: "Processing error. Manual check required.",
      translatedText: description,
      entities: {},
      routingOffice: "General HQ"
    };
  }
};

export const getQuickSupport = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      systemInstruction: "You are 'Dak-Mitra', the official India Post digital assistant. Be professional, concise, and helpful."
    }
  });
  return response.text;
};
