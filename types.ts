
export interface Prompt {
  value: number;
  title: string;
  description: string;
}

export interface AIChoice {
  title: string;
  description: string;
}

export interface AIRecommendation {
  recommendation: string;
  choices: AIChoice[];
}

export interface ConversationTurn {
  promptTitle: string;
  promptDescription: string;
  aiRecommendation: AIRecommendation;
}

export interface Nuance {
  title: string;
  detail: string;
  importance: number;
  workshopContent?: Record<string, string>;
}

export interface DeepResearchData {
  summary: string;
  nuances: Nuance[];
}

export interface SavedThread {
  id: string;
  originalPromptTitle: string;
  turns: ConversationTurn[];
  savedAt: string;
  deepResearch?: DeepResearchData;
  isGeneratingResearch?: boolean;
}