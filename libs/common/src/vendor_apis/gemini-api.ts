import { Injectable } from '@nestjs/common';
import { HttpClient } from '../http_client';
import { GEMINI_API_URL, GEMINI_DEFAULT_MODEL } from '../constants';
import { AIVendor, AIVendorPayload, GeminiResponse } from '../types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiVendor implements AIVendor {
  private readonly configService = new ConfigService();
  private readonly GEMINI_API_URL =
    this.configService.get<string>(GEMINI_API_URL);
  private readonly httpClient = new HttpClient(this.GEMINI_API_URL, {
    timeout: 10000,
  });

  async ask(payload: AIVendorPayload): Promise<string> {
    const {
      api_key,
      model = this.configService.get<string>(GEMINI_DEFAULT_MODEL),
      text,
      prompt = `
    Analyze the following text and answer it like human would do.
    `,
    } = payload;

    const payloadData = {
      contents: [
        {
          parts: [{ text: `${prompt}\n\n${text}` }],
        },
      ],
    };

    try {
      const data = await this.httpClient.post<GeminiResponse>(
        `/${model}:generateContent?key=${api_key}`,
        payloadData,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const responseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      return responseText;
    } catch (error) {
      console.error('Error during analysis request:', error);
      throw error;
    }
  }
}
