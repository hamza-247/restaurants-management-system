
import { GoogleGenAI, Type } from "@google/genai";
import { Order, InventoryItem, MenuItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getManagerInsights(orders: Order[], inventory: InventoryItem[]) {
  const prompt = `
    As a restaurant data analyst, analyze the following current state of the restaurant and provide brief, actionable insights.
    
    Current Orders (last few): ${JSON.stringify(orders.slice(-5))}
    Current Inventory Levels: ${JSON.stringify(inventory)}
    
    Focus on:
    1. Items that might run out soon.
    2. Revenue trends (if any).
    3. Operational efficiency suggestions.
    
    Format the response as clear bullet points.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate insights at this time.";
  }
}

export async function suggestMenuImprovements(menu: MenuItem[]) {
  const prompt = `Analyze this restaurant menu: ${JSON.stringify(menu)}. 
  Suggest 2-3 improvements for menu engineering (pricing adjustments, better item naming, or category balance) to increase profitability.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    return "Menu analysis unavailable.";
  }
}
