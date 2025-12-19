
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ComplaintAnalysis, GroundingLink } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeComplaint = async (description: string, imageUrl?: string, context?: string, trackingNumber?: string): Promise<ComplaintAnalysis> => {
  const ai = getAI();
  const model = "gemini-3-pro-preview";
  
  const systemInstruction = `
    You are the Principal Intelligence Architect for India Post (Posty).
    Your task is to generate a HIGH-DENSITY data briefing for postal staff.
    
    PRIORITY ENGINE (1-100):
    - keywordSeverity: Detect words like 'medicine', 'court', 'bank', 'passport', 'delay', 'urgent', 'loss', 'theft'.
    - sentimentImpact: Quantify anger, desperation, or frustration.
    - categoryWeight: 'Lost Parcel' (90), 'Staff Misconduct' (85), 'Delivery Delay' (60), 'General Enquiry' (30).
    
    CITIZEN INSIGHT:
    - Synthesize a 'Citizen DNA' profile based on their grievance history and tone.
    
    LOGISTICS AUDIT:
    - If tracking number exists (e.g., EB12345IN), provide a technical hypothesis of where the failure occurred (Sortation Hub, Postman Delivery, or NSH Transit).
    
    INVESTIGATION STRATEGY:
    - Provide 3-4 actionable technical steps for an officer to take.
  `;

  const parts: any[] = [
    { text: `Staff Context (Previous Interaction History): ${context || "None"}` },
    { text: `Current Grievance Text: ${description}` },
    { text: `Tracking ID: ${trackingNumber || "N/A"}` }
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
            emotionalToneScore: { type: Type.INTEGER },
            urgencyScore: { type: Type.INTEGER },
            priorityScore: { type: Type.INTEGER },
            priorityLabel: { type: Type.STRING },
            summary: { type: Type.STRING },
            suggestedResponse: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            translatedText: { type: Type.STRING },
            slaDeadline: { type: Type.STRING },
            predictedResolutionHours: { type: Type.INTEGER },
            intelligenceBriefing: {
              type: Type.OBJECT,
              properties: {
                suggestedRegulations: { type: Type.ARRAY, items: { type: Type.STRING } },
                riskAssessment: { type: Type.STRING },
                investigationStrategy: { type: Type.ARRAY, items: { type: Type.STRING } },
                logisticsAudit: { type: Type.STRING },
                escalationProbability: { type: Type.INTEGER },
                recommendedTone: { type: Type.STRING },
                priorityBreakdown: {
                  type: Type.OBJECT,
                  properties: {
                    keywordSeverity: { type: Type.INTEGER },
                    sentimentImpact: { type: Type.INTEGER },
                    categoryWeight: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  }
                },
                citizenProfile: {
                  type: Type.OBJECT,
                  properties: {
                    loyaltyLevel: { type: Type.STRING },
                    previousResolutionSatisfaction: { type: Type.STRING },
                    historicalSentimentTrend: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text?.trim() || "{}");
  } catch (error) {
    console.error("AI Strategic Analysis Failed:", error);
    return {
      category: "Other",
      sentiment: "Neutral",
      emotionalToneScore: 50,
      urgencyScore: 50,
      priorityScore: 50,
      priorityLabel: "Routine",
      summary: "Manual classification required.",
      suggestedResponse: "Namaste. Your grievance is being reviewed by our specialists.",
      tags: ["manual-review"],
      translatedText: description,
      slaDeadline: new Date(Date.now() + 86400000 * 3).toISOString(),
      predictedResolutionHours: 72,
      intelligenceBriefing: {
        suggestedRegulations: ["SOP Grievance v4"],
        riskAssessment: "Medium",
        investigationStrategy: ["Contact local postmaster", "Verify tracking logs"],
        escalationProbability: 10,
        recommendedTone: "Formal",
        priorityBreakdown: {
          keywordSeverity: 50,
          sentimentImpact: 50,
          categoryWeight: 50,
          explanation: "Fallback priority assigned."
        },
        citizenProfile: {
          loyaltyLevel: "New",
          previousResolutionSatisfaction: "N/A",
          historicalSentimentTrend: "Stable"
        }
      }
    };
  }
};

export const polishDraft = async (draft: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Polish this draft for an India Post official: "${draft}"`,
      config: { systemInstruction: "Formal, authoritative, and empathetic India Post tone." }
    });
    return response.text || draft;
  } catch (e) {
    return draft;
  }
};

export interface QuickSupportResult {
  text: string;
  links?: GroundingLink[];
}

export const getQuickSupport = async (query: string, userHistory?: string): Promise<QuickSupportResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `User Query: ${query}\nUser Context: ${userHistory || "None"}`,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "You are Dak-Mitra from Posty. Use official India Post information. If the user asks about their complaints, refer to their history context provided.",
    },
  });

  const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const links: GroundingLink[] = [];
  
  for (const chunk of rawChunks) {
    if (chunk.web && chunk.web.title && chunk.web.uri) {
      links.push({ title: String(chunk.web.title), uri: String(chunk.web.uri) });
    }
  }

  return {
    text: response.text || "Connection issue.",
    links: links.length > 0 ? links : undefined
  };
};

export const findNearbyBranches = async (lat: number, lng: number): Promise<{ text: string, links: string[] }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find 3 nearest India Post offices.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
      }
    });
    
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapsLinks: string[] = [];
    
    for (const chunk of rawChunks) {
      if (chunk.maps && chunk.maps.uri) {
        mapsLinks.push(String(chunk.maps.uri));
      }
    }

    return {
      text: response.text || "No branches found.",
      links: mapsLinks
    };
  } catch (e) {
    return { text: "Location services unavailable.", links: [] };
  }
};

export const extractDetailsFromImage = async (base64Image: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
          { text: "Extract Tracking Number and Post Office Name. Return JSON." }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trackingNumber: { type: Type.STRING },
            postOffice: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text?.trim() || "{}");
  } catch (e) {
    return null;
  }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (e) {
    console.error("TTS Failed:", e);
    return undefined;
  }
};

export const decodeAudio = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
