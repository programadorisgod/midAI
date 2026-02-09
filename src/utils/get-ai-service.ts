import { AIService } from "../interfaces/ai-service.js";
import { CerebrasService } from "../services/cerebras/cerebras.js";
import { GroqService } from "../services/groq/groq.js";
import { GoogleGenAIServices } from "../services/gemini/gemini.js";
import { OpenRouterService } from "../services/open-router/open-router.js";
//import { DeepSeekService } from "../services/deepseek/deepseek.js";
import { GitHubService } from "../services/github/github.js";

let currentIndex = 0;

const AIServices: AIService[] = [
  new GitHubService(),
  new CerebrasService(),
  new GoogleGenAIServices(),
  new GroqService(),
  new OpenRouterService(),
  //new DeepSeekService(),
];
const { length: AIServicesLength } = AIServices;

export { AIServicesLength };

export const getAIService = () => {
  const service = AIServices[currentIndex];

  console.log("Using AI Service:", service.constructor.name);

  currentIndex = (currentIndex + 1) % AIServices.length;

  return service;
};
