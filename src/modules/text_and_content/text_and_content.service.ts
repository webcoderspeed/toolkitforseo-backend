import { Injectable } from '@nestjs/common';
import {
  PlagiarismCheckerDto,
  ParaphraseResponseDto,
  AIContentResponseDto,
  ProofreadResponseDto,
  RephraseResponseDto,
  SummarizeResponseDto,
  GrammarCheckResponseDto,
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

  async paraphraseText(text: string): Promise<ParaphraseResponseDto> {
    try {
      return {
        originalText: text,
        paraphrasedText: text,
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

  async checkGrammar(text: string): Promise<GrammarCheckResponseDto> {
    try {
      return {
        originalText: text,
        errors: [],
        suggestions: [],
      };
    } catch (error) {
      throw new Error('Failed to check grammar');
    }
  }
}
