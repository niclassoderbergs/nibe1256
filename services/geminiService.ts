
import { GoogleGenAI } from "@google/genai";
import { MY_HOUSE, MY_SYSTEM } from "../constants";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client && process.env.API_KEY) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const getHeatingAdvice = async (userQuery: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API Key not configured properly.";

  const systemContext = `
    Du är en expert på VVS och värmepumpar (NIBE S1256).
    Huset: Timmerhus i Åre, 160m2 uppvärmt, renoverat 2015.
    
    ANVÄNDARDATA (VIKTIGT - MÄTVÄRDEN FRÅN GRAFER):
    Användaren har mätt temperaturen direkt på radiatorerna/konvektorerna.
    1. Konvektorer (Plan 2): Toppar på ca 48-49°C.
    2. Golvvärme (Plan 2 Entré): Yttemperatur ca 28°C.
    
    HUSFYSIK (Beräknat):
    Specifik värmeförlust: ca 175 W/K.
    Effektbehov vid -20°C: ca 6.4 kW.
    Effektbehov vid -30°C: ca 8.2 kW.
    
    PROBLEM/UTMANING:
    Huset behöver ca 6.4 kW vid -20°C.
    VP:n kan leverera detta (13kW modell), MEN radiatorerna/konvektorerna är underdimensionerade för lågtemperatursystem.
    Vid 48°C framledning ger konvektorerna bara ca 50% av sin märkeffekt.
    
    Användaren frågar: "${userQuery}"
    
    Svara kort och tekniskt. Koppla gärna ihop husets effektbehov (kW) med vad radiatorerna faktiskt kan avge vid nuvarande temperaturer.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: systemContext,
    });
    return response.text || "Kunde inte generera ett svar just nu.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ett fel uppstod vid kontakt med AI-tjänsten.";
  }
};
