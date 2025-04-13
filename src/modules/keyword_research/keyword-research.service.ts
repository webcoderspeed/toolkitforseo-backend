import { Injectable } from '@nestjs/common';
import { KeywordCompetitionDto } from './dtos';
import { outputParser, tryCatch } from '@app/common';
import { AIVendorFactory } from '@app/common/factories';

@Injectable()
export class KeywordResearchService {
  async checkKeywordCompetition(dto: KeywordCompetitionDto, api_key: string) {
    try {
      const { text } = dto;

      const prompt = `
You are an expert SEO keyword analysis tool. Analyze the provided text and identify relevant keywords, along with their associated metrics and competitor information.

Text to analyze:

${text}

Instructions:

1. Analyze the provided text and identify relevant keywords.
2. For each identified keyword, gather the following information:
   - url: A relevant URL associated with the keyword or a search results page for that keyword.
   - keyword_overlap: A numerical value representing the percentage overlap of this keyword with the provided text.
   - competitors_keywords: The total number of keywords your competitors are targeting on pages related to this keyword.
   - common_keywords: The number of keywords you share with your competitors for this specific keyword.
   - share: A numerical value representing your keyword share compared to competitors (0 to 1).
   - target_keywords: The total number of keywords you are targeting on pages related to this keyword.
   - dr: Domain Rating (DR) of the URL associated with the keyword.
   - traffic: Estimated monthly search traffic for the keyword.
   - value: Estimated monetary value of the keyword, based on potential traffic and conversion rates.
3. Return the results in a JSON object with the following structure:
{
  "keywords": [
    {
      "url": string,
      "keyword_overlap": number,
      "competitors_keywords": number,
      "common_keywords": number,
      "share": number,
      "target_keywords": number,
      "dr": number,
      "traffic": number,
      "value": number
    },
    // ... few more keywords ...
  ]
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

      if (error) throw new Error('Failed to check keyword competition');

      return data;
    } catch (error) {
      throw new Error('Failed to check keyword competition');
    }
  }
}
