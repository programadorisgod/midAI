import { AIService } from "../interfaces/ai-service.js";
import { CerebrasService } from "../services/cerebras/cerebras.js";
import { GroqService } from "../services/groq/groq.js";
import { GoogleGenAIServices } from "../services/gemini/gemini.js";
import { OpenRouterService } from "../services/open-router/open-router.js";

let currentIndex = 0;

export const getAIService = () => {
  const AIServices: AIService[] = [
    new GroqService(),
    new CerebrasService(),
    new GoogleGenAIServices(),
    new OpenRouterService(),
  ];

  console.log("Using AI Service:", AIServices[currentIndex].constructor.name);

  const nextService = (currentIndex + 1) % AIServices.length;

  currentIndex = nextService;

  return AIServices[currentIndex];
};
