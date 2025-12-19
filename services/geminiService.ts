
import { GoogleGenAI, Type } from "@google/genai";
import { ComplaintAnalysis } from "../types";

export const analyzeComplaint = async (description: string, imageUrl?: string, context?: string, trackingNumber?: string): Promise<ComplaintAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an official digital assistant for Posty (a smart redressal system). 
    Your role is to help summarize incoming complaints for staff to review quickly.
    
    GUIDELINES:
    - Avoid using technical jargon like "AI", "algorithm", "triage", or "machine learning".
    - Use simple, professional language that citizens and staff can easily understand.
    - URGENCY LEVEL (1-100):
       - 90-100: Critical / Essential (Medicines, Passport, Legal documents, Pension, Exam results).
       - 70-89: Time-sensitive (Business items, Delivery delays over 5 days).
       - 40-69: Standard issues.
       - 1-39: General queries.
    - DEADLINE: Calculate a reasonable response time based on urgency.
    - DUPLICATE CHECK: Check if this looks like a repeat of previous complaints in the context provided.
    - TRANSLATION: If the user writes in Hindi or Telugu, provide a professional English version in 'translatedText'.
    - CATEGORY: Pick one: Delivery Delay, Lost Parcel, Damaged Item, Wrong Delivery, Staff Misconduct, Refund/Payment Issue, or Other.
  `;

  const now = new Date().toISOString();
  const parts: any[] = [
    { text: `Today's Date: ${now}` },
    { text: `Provided Tracking Number: ${trackingNumber || "Not provided"}` },
    { text: `Previous records for reference: ${context || "None"}` },
    { text: `User's complaint: ${description}` }
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
            priorityScore: { type: Type.INTEGER },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedResponse: { type: Type.STRING },
            summary: { type: Type.STRING },
            translatedText: { type: Type.STRING },
            routingOffice: { type: Type.STRING },
            slaDeadline: { type: Type.STRING },
            isPotentialDuplicate: { type: Type.BOOLEAN },
            duplicateConfidence: { type: Type.NUMBER },
            duplicateOfId: { type: Type.STRING },
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
          required: ["category", "sentiment", "priority", "priorityScore", "tags", "suggestedResponse", "summary", "translatedText", "entities", "routingOffice", "slaDeadline", "isPotentialDuplicate"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Analysis failed:", error);
    const fallbackDate = new Date();
    fallbackDate.setHours(fallbackDate.getHours() + 72);
    return {
      category: "Other",
      sentiment: "Neutral",
      priority: "Medium",
      priorityScore: 50,
      tags: ["review-needed"],
      suggestedResponse: "We have received your complaint and an officer will review it shortly.",
      summary: "Automatic summary unavailable. Please read description.",
      translatedText: description,
      entities: { tracking_number: trackingNumber },
      routingOffice: "General",
      slaDeadline: fallbackDate.toISOString(),
      isPotentialDuplicate: false
    };
  }
};

export const getQuickSupport = async (query: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      systemInstruction: "You are Dak-Mitra, an official digital friend from Posty. Help citizens with tracking, finding pin codes, and filing complaints. Use very simple and polite language. Avoid technical words.",
    },
  });
  return response.text || "Maaf kijiye, main abhi madad nahi kar sakta. (Sorry, I cannot help right now.)";
};
