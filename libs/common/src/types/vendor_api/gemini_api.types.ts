export interface GeminiResponse {
  candidates: Candidate[];
  promptFeedback: PromptFeedback;
  usageMetadata: UsageMetadata;
}

export interface Candidate {
  content: Content;
  finishReason: string;
  index: number;
  safetyRatings: SafetyRating[];
}

export interface Content {
  parts: Part[];
}

export interface Part {
  text: string;
}

export interface SafetyRating {
  category: string;
  probability: string;
}

export interface PromptFeedback {
  safetyRatings: SafetyRating[];
}

export interface UsageMetadata {
  candidatesTokenCount: number;
  promptTokenCount: number;
  totalTokenCount: number;
}

export interface GeminiAskPayload {
  prompt?: string;
  text: string;
  api_key: string;
  model?: 'gemini-2.0-flash' | string;
}
