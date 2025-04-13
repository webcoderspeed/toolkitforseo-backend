import { Injectable } from '@nestjs/common';
import {
  PlagiarismCheckerDto,
  AIContentResponseDto,
  ProofreadResponseDto,
  RephraseResponseDto,
  SummarizeResponseDto,
  ParaphraseDto,
  GrammarCheckerDto,
} from './dtos';
import { outputParser, tryCatch } from '@app/common';
import { AIVendorFactory } from '@app/common/factories';

@Injectable()
export class TextAndContentService {
  async checkPlagiarism(dto: PlagiarismCheckerDto, api_key: string) {
    try {
      const {
        text,
        settings = {
          detection_model: 'Standard',
        },
      } = dto;

      const prompt = `
    You are an expert plagiarism detection system. Analyze the following text and determine if any part of it appears to be plagiarized from online sources.

    Based on the provided detection_model, adjust the sensitivity and thoroughness of your analysis.

    Available detection_models:

    - Standard: A balanced approach, suitable for general plagiarism checks.
    - Academic: More sensitive and thorough, designed for academic content.
    - Thorough: The most rigorous analysis, checking for subtle similarities.

    Detection Model: ${settings?.detection_model ?? 'Standard'}

    Text to analyze:

    ${text}

    Return a JSON object with the following structure:
    {
      "score": <a numeric score from 0 to 100 representing the overall likelihood of plagiarism>,
      "original_content": <a numeric value from 0 to 100 representing the percentage of original content>,
      "plagiarized_content": <a numeric value from 0 to 100 representing the percentage of plagiarized content>,
      "sources": [
        {
          "url": "<source URL that closely matches the plagiarized content>",
          "similarity": <percentage similarity to this source (0 to 100)>
        }
        // You may include multiple sources if applicable
      ]
    }
      `;
      const vendor = AIVendorFactory.createVendor(dto.vendor ?? 'gemini');

      const response = await vendor.ask({
        prompt,
        api_key,
        ...(dto?.model ? { model: dto.model } : {}),
      });

      const { data, error } = await tryCatch(() => outputParser(response));

      if (error) throw new Error('Failed to check plagiarism');

      return data;
    } catch (error) {
      console.error('Plagiarism check failed:', error);
      throw new Error('Failed to check plagiarism');
    }
  }

  async paraphraseText(dto: ParaphraseDto, api_key: string) {
    try {
      const {
        text,
        settings = {
          mode: 'Standard',
          strength: 50,
        },
      } = dto;

      const prompt = `
    You are an advanced paraphrasing tool. Your task is to rewrite the given text while maintaining its original meaning. You will adjust the style and vocabulary based on the provided settings.

    Available modes:

    - Standard: Focuses on clarity and natural language, suitable for general use.
    - Fluency: Emphasizes smooth and sophisticated language, ideal for professional content.
    - Creative: Prioritizes originality and artistic expression, suitable for creative writing.

    Settings:

    - Mode: ${settings?.mode ?? 'Standard'}
    - Strength: ${settings?.strength ?? 50} (A value from 0 to 100, where 0 means minimal change and 100 means maximum change)

    Input Text:

    ${text}

    Instructions:

    1. Analyze the input text and the provided settings.
    2. Apply the specified mode to adjust the style and vocabulary of the text.
    3. Use the strength setting to control the degree of change. A higher strength will result in more significant alterations to the text.
    4. Maintain the original meaning of the text throughout the paraphrasing process.
    5. Return only the paraphrased text. Do not include any additional explanations or JSON formatting.

    Paraphrased Text:
  `;

      const vendor = AIVendorFactory.createVendor(dto.vendor ?? 'gemini');
      const response = await vendor.ask({
        prompt,
        api_key,
        ...(dto?.model ? { model: dto.model } : {}),
      });

      return {
        paraphrased_text: response,
      };
    } catch (error) {
      throw new Error('Failed to paraphrase text');
    }
  }

  async detectAIContent(text: string): Promise<AIContentResponseDto> {
    try {
      return {
        originalText: text,
        aiProbability: 0,
        isAIGenerated: false,
      };
    } catch (error) {
      throw new Error('Failed to detect AI content');
    }
  }

  async proofreadText(text: string): Promise<ProofreadResponseDto> {
    try {
      return {
        originalText: text,
        corrections: [],
        suggestions: [],
      };
    } catch (error) {
      throw new Error('Failed to proofread text');
    }
  }

  async rephraseSentence(text: string): Promise<RephraseResponseDto> {
    try {
      return {
        originalText: text,
        rephrasedText: text,
      };
    } catch (error) {
      throw new Error('Failed to rephrase sentence');
    }
  }

  async summarizeText(text: string): Promise<SummarizeResponseDto> {
    try {
      return {
        originalText: text,
        summary: text,
      };
    } catch (error) {
      throw new Error('Failed to summarize text');
    }
  }

  async checkGrammar(dto: GrammarCheckerDto, api_key: string) {
    try {
      const { text } = dto;

      const prompt = `
           You are an advanced grammar and spelling checker. Analyze the following text and identify any grammatical errors, spelling mistakes, and punctuation issues.

          Text to analyze:

          ${text}

          Instructions:

          1. Identify all grammatical errors, spelling mistakes, and punctuation issues in the provided text.
          2. For each error, provide the following information:
            - type: "grammar", "spelling", or "punctuation" indicating the type of error.
            - text: The incorrect text found in the original input.
            - suggestion: A corrected version of the incorrect text.
            - position: An array containing the start and end character positions [start, end] of the incorrect text within the original input.
          3. Provide an overall score (0 to 100) representing the grammatical correctness of the text. 100 indicates perfect grammar.
          4. Return the results in a JSON object with the following structure:
            {
              "errors": [
                {
                  "type": "grammar" | "spelling" | "punctuation",
                  "text": string,
                  "suggestion": string,
                  "position": [number, number]
                },
                // ... more errors if found ...
              ],
              "score": number,
              "corrected_text":  <string>
            }

          Output JSON:
        `;

      const vendor = AIVendorFactory.createVendor(dto.vendor ?? 'gemini');

      const response = await vendor.ask({
        prompt,
        api_key,
        ...(dto?.model ? { model: dto.model } : {}),
      });

      const { data, error } = await tryCatch(() => outputParser(response));

      if (error) throw new Error('Failed to check grammar');

      return data;
    } catch (error) {
      throw new Error('Failed to check grammar');
    }
  }
}
