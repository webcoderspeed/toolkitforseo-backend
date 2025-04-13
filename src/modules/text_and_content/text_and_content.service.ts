import { Injectable } from '@nestjs/common';
import {
  ParaphraseResponseDto,
  AIContentResponseDto,
  ProofreadResponseDto,
  RephraseResponseDto,
  SummarizeResponseDto,
  GrammarCheckResponseDto,
  TextInputDto,
} from './dtos';
import { GeminiVendor } from '@app/common/vendor_apis';
import { outputParser, tryCatch } from '@app/common';

@Injectable()
export class TextAndContentService {
  constructor(private readonly _geminiApiService: GeminiVendor) {}

  async checkPlagiarism(dto: TextInputDto, api_key: string) {
    try {
      const prompt = `
        You are an expert plagiarism detection system. Analyze the following text and determine if any part of it appears to be plagiarized from online sources.

        Return a JSON object with the following structure:
        {
          "score": <a numeric score from 0 to 100 representing the likelihood of plagiarism>,
          "original_content": "<segments of the text that appear to be original>",
          "plagiarized_content": "<segments of the text that appear to be plagiarized or heavily borrowed>",
          "sources": [
            {
              "url": "<source URL that closely matches the plagiarized content>",
              "similarity": <percentage similarity to this source (0 to 100)>
            },
            ...
          ]
        }
      `;

      const response = await this._geminiApiService.ask({
        prompt: dto?.prompt ?? prompt,
        api_key: api_key,
        text: dto.text,
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

  async rewriteArticle(dto: TextInputDto, api_key: string) {
    try {
      const {
        text,
        prompt = `
        You are an expert article rewriter. Your task is to analyze a given article and rewrite it to enhance its clarity, coherence, and overall quality.
        Analyze the article thoroughly, paying attention to its structure, content, and overall tone. Identify any areas that may need improvement, such as unclear sentences, inconsistent grammar, or missing key information.
        Use your expertise in writing to suggest improvements that enhance the clarity and effectiveness of the article. Consider the target audience and the intended audience for the rewritten article.
        Provide a well-structured and well-organized rewrite of the article, ensuring that it retains its original meaning and context.
        Return a JSON response in the following format:
        \`\`\`json
        {
          "originalText": string, // The original text being analyzed
          "rewrittenText": string, // The rewritten text
        }
        \`\`\`
        Ensure that the JSON response is well-formed and adheres strictly to the specified format. Any deviations from the format may result in parsing errors.
        Provide the JSON response without any additional explanatory text or preamble. Only include the JSON itself. Ensure no comments are provided in JSON, no extra new lines at the begining and end.
      `,
      } = dto;

      const response = await this._geminiApiService.ask({
        prompt: prompt,
        api_key: api_key,
        text: text,
        ...(dto?.model ? { model: dto.model } : {}),
      });

      const cleaned = response.replace(/```json\n?/, '').replace(/\n?```/, '');
      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (error) {
      throw new Error('Failed to rewrite article');
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
