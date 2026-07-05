import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Initialize GoogleGenAI server-side with metadata header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route: Generate Radio Script Bites
  app.post("/api/generate-script", async (req, res) => {
    try {
      const { persona, topic, bitesCount = 5 } = req.body;

      const systemPrompt = `You are an expert radio show scriptwriter for Xtrata FM, a radio station dedicated to Stacks blockchain, Stacks Layer 2 ecosystem, and Stacks data inscriptions.
Xtrata is an on-chain data inscription service on the Stacks blockchain (similar to Bitcoin Ordinals but built on Stacks L2, making it much cheaper, faster, yet still fully on-chain and decentralized).

Generate ${bitesCount} highly engaging, natural-sounding, bite-sized radio host scripts (sound bites) based on the topic: "${topic}".

DJ Persona: ${persona}.
- DEGEN_TRADER: Extremely high energy, uses crypto slang (gm, lfg, degen, alpha, stack, satoshis, snek, apeing, on-chain), loves airhorns and bass drops, treats inscriptions like precious digital relics.
- TECH_BUILDER: Smart, visionary, focused on the architecture. Emphasizes decentralization, Stacks sBTC, L2 performance, cost savings compared to L1 Bitcoin Ordinals, security of Bitcoin base layer. Professional yet passionate.
- SYNTHWAVE_CLASSIC: Cool, laid-back, late-night vibe. Uses retro-futuristic terminology, smooth transitions, talking over ambient beats, retro station IDs.
- RADIO_LEGEND: Traditional high-energy AM/FM professional DJ. Lots of vocal variation, station jingles ("You're locked into Xtrata FM!"), smooth audience connection, big energy.

Write short, punchy scripts designed to be read aloud (between 10 to 45 seconds each). Incorporate natural speech fillers, excitement, and radio style. Ensure the text flows well for speech synthesis. Include suggested radio sound effects (SFX).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Generate the radio DJ script sound bites now.",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { 
                  type: Type.STRING, 
                  description: "A short catchy title of this soundbite" 
                },
                content: { 
                  type: Type.STRING, 
                  description: "The actual script text for the DJ to speak. Write it in a highly conversational, readable format suitable for text-to-speech." 
                },
                category: { 
                  type: Type.STRING,
                  description: "One of: Promo, Educational, Hype, Banter, Station ID"
                },
                suggestedSfx: { 
                  type: Type.STRING,
                  description: "One of: airhorn, bass_drop, laser_siren, record_scratch, radio_static, electronic_ping, none"
                },
                durationSec: { 
                  type: Type.INTEGER, 
                  description: "Estimated duration to read in seconds (typically between 10 and 45)" 
                }
              },
              required: ["title", "content", "category", "suggestedSfx", "durationSec"]
            }
          }
        }
      });

      const jsonText = response.text || "[]";
      res.json(JSON.parse(jsonText));
    } catch (error: any) {
      console.error("Error generating script:", error);
      res.status(500).json({ error: error.message || "Failed to generate script" });
    }
  });

  // API Route: Premium TTS Voice Generation using Gemini TTS
  app.post("/api/synthesize-speech", async (req, res) => {
    try {
      const { text, voice = "Zephyr" } = req.body;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Say with enthusiasm: ${text}` }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice }, // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        res.json({ audio: base64Audio });
      } else {
        res.status(400).json({ error: "No audio generated from Gemini TTS" });
      }
    } catch (error: any) {
      console.error("Error in premium speech synthesis:", error);
      res.status(500).json({ error: error.message || "Failed to synthesize speech" });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
