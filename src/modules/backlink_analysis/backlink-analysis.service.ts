import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  BacklinkCheckerDto,
  AnchorTextDistributionDto, // <-- Ensure this is imported
  WebsiteLinkCountCheckerDto,
  ValuableBacklinkCheckerDto,
} from './dtos';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url'; // <-- Ensure this is imported
import { AIVendorFactory } from '@app/common/factories'; // <-- Ensure this is imported
import { outputParser, tryCatch } from '@app/common'; // <-- Ensure these are imported

@Injectable()
export class BacklinkAnalysisService {
  private readonly logger = new Logger(BacklinkAnalysisService.name);

  async backlinkChecker(dto: BacklinkCheckerDto, apiKey: string) {
    // TODO: Implement using cheerio, AI, or external APIs
    return {
      totalBacklinks: 4411,
      doFollowLinks: 2282,
      noFollowLinks: 2129,
      referringDomains: 1410,
      topLevelDomains: [
        { domain: '.com', count: 643 },
        { domain: '.io', count: 598 },
        { domain: '.gov', count: 500 },
        { domain: '.net', count: 447 },
        { domain: '.org', count: 117 },
        { domain: '.edu', count: 88 },
      ],
      topBacklinks: [
        {
          url: 'https://techblog.com/page-7',
          domain: 'techblog.com',
          anchorText: 'source',
          doFollow: true,
          pageAuthority: 77,
        },
        // ...more
      ],
    };
  }

  async anchorTextDistribution(dto: AnchorTextDistributionDto, apiKey: string) {
    this.logger.log(
      `Starting anchor text distribution analysis for URL: ${dto.url}`,
    );
    const { url } = dto;

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        },
        timeout: 10000,
      });
      const html = response.data;
      const $ = cheerio.load(html);

      const anchorTexts: string[] = [];
      $('a').each((_, element) => {
        const text = $(element).text().trim();
        if (text && text.length > 1) {
          anchorTexts.push(text);
        }
      });

      if (anchorTexts.length === 0) {
        this.logger.warn(`No anchor texts found on URL: ${url}`);
        return {
          totalBacklinks: 0, 
          anchorTextCategories: [],
          topAnchorTexts: [],
          diversityScore: 0,
        };
      }

      console.log(anchorTexts);

      const textsToAnalyze = anchorTexts.slice(0, 250); 

      const prompt = `
You are an expert SEO analyst specializing in backlink anchor text analysis. Analyze the provided list of anchor texts from the URL: ${url}.

Anchor Texts:
${JSON.stringify(textsToAnalyze)}

Instructions:
1. Calculate the total number of anchor texts provided (${textsToAnalyze.length}).
2. Categorize each anchor text into one of the following types:
    - Branded: Contains the brand name (infer based on common patterns if URL is provided).
    - Naked URL: The anchor text is a URL (e.g., "www.example.com").
    - Generic: Common non-descriptive phrases (e.g., "click here", "read more", "website").
    - Exact Match: The anchor text is a specific target keyword (requires context, make best guess).
    - Partial Match: Contains part of a target keyword.
    - Other: Anything else.
3. For each category, calculate the count and percentage of the total anchor texts analyzed. Provide 1-3 examples for each category found.
4. Identify the top 5 most frequent anchor texts, their counts, and their percentage of the total.
5. Calculate an overall Anchor Text Diversity Score (0-100), where 100 is highly diverse (good mix of categories, low repetition) and 0 is very low diversity (e.g., all links are "click here"). Consider the distribution across categories and the repetition of specific texts.

Return the analysis ONLY in the following JSON format:
{
  "totalBacklinks": ${textsToAnalyze.length}, // Total anchor texts analyzed
  "anchorTextCategories": [
    {
      "category": "Branded | Naked URL | Generic | Exact Match | Partial Match | Other",
      "count": number,
      "percentage": number, // (count / totalBacklinks) * 100, rounded to 1 decimal
      "examples": [string] // 1-3 examples from the provided list
    }
    // ... include all categories found ...
  ],
  "topAnchorTexts": [
    {
      "text": string, // The specific anchor text
      "count": number,
      "percentage": number // (count / totalBacklinks) * 100, rounded to 1 decimal
    }
    // ... top 50 most frequent texts ...
  ],
  "diversityScore": number // Score from 0 to 100
}
`;

      // 4. Call AI Vendor
      const vendor = AIVendorFactory.createVendor(dto.vendor ?? 'gemini');
      const aiResponse = await vendor.ask({
        prompt,
        api_key: apiKey,
        ...(dto?.model ? { model: dto.model } : {}),
      });

      // 5. Parse Response
      const { data, error } = await tryCatch(() => outputParser(aiResponse));
      if (error) {
        this.logger.error(
          `Failed to parse AI response for anchor text analysis: ${error}`,
          aiResponse,
        );
        throw new InternalServerErrorException(
          'Failed to parse AI response for anchor text analysis',
        );
      }

      this.logger.log(
        `Finished anchor text distribution analysis for URL: ${url}`,
      );
      return data;
    } catch (error) {
      this.logger.error(
        `Failed anchor text distribution analysis for URL ${url}: ${error.message}`,
        error.stack,
      );
      if (axios.isAxiosError(error)) {
        throw new InternalServerErrorException(
          `Failed to fetch URL ${url}: ${error.response?.statusText || error.message}`,
        );
      }
      throw new InternalServerErrorException(
        `Error processing anchor text distribution for ${url}`,
      );
    }
  }

  async websiteLinkCountChecker(
    dto: WebsiteLinkCountCheckerDto,
    apiKey: string,
  ) {
    this.logger.log(`Starting website link count check for URL: ${dto.url}`);
    try {
      const response = await axios.get(dto.url, {
        headers: {
          // Add headers to mimic a browser if needed
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        },
        timeout: 10000, // 10 second timeout
      });

      const html = response.data;
      const $ = cheerio.load(html);
      const baseUrl = new URL(dto.url);
      const baseDomain = baseUrl.hostname;

      let totalLinks = 0;
      let internalLinks = 0;
      let externalLinks = 0;
      let potentiallyBrokenLinks = 0;
      const externalDomainCounts: Record<string, number> = {};
      const internalPathCounts: Record<string, number> = {};

      $('a').each((_, element) => {
        totalLinks++;
        const href = $(element).attr('href');

        if (
          !href ||
          href.startsWith('#') ||
          href.startsWith('javascript:') ||
          href.startsWith('mailto:')
        ) {
          potentiallyBrokenLinks++;
          return; // Skip anchor links, javascript calls, mailto links
        }

        try {
          const absoluteUrl = new URL(href, baseUrl.origin); // Resolve relative URLs
          const linkDomain = absoluteUrl.hostname;

          if (linkDomain === baseDomain) {
            internalLinks++;
            const path = absoluteUrl.pathname;
            internalPathCounts[path] = (internalPathCounts[path] || 0) + 1;
          } else {
            externalLinks++;
            externalDomainCounts[linkDomain] =
              (externalDomainCounts[linkDomain] || 0) + 1;
          }
        } catch (e) {
          // Handle invalid URLs (could be considered broken/problematic)
          potentiallyBrokenLinks++;
          this.logger.warn(
            `Invalid URL encountered: ${href} on page ${dto.url}`,
          );
        }
      });

      const getTopItems = (counts: Record<string, number>, n: number) => {
        return Object.entries(counts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, n)
          .map(([key, count]) => ({ key, count }));
      };

      const topExternalDomains = getTopItems(externalDomainCounts, 10).map(
        (item) => ({ domain: item.key, count: item.count }),
      );
      const topInternalPaths = getTopItems(internalPathCounts, 10).map(
        (item) => ({ path: item.key, count: item.count }),
      );

      this.logger.log(`Finished website link count check for URL: ${dto.url}`);

      return {
        totalLinks,
        internalLinks,
        externalLinks,
        brokenLinks: potentiallyBrokenLinks, // Renamed for clarity, as it's not a definitive broken check
        topExternalDomains,
        topInternalPaths,
        linkDistribution: [
          { category: 'internal', count: internalLinks },
          { category: 'external', count: externalLinks },
          {
            category: 'potentially broken/invalid',
            count: potentiallyBrokenLinks,
          },
        ],
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch or process URL ${dto.url}: ${error.message}`,
        error.stack,
      );
      if (axios.isAxiosError(error)) {
        throw new InternalServerErrorException(
          `Failed to fetch URL ${dto.url}: ${error.response?.statusText || error.message}`,
        );
      }
      throw new InternalServerErrorException(
        `Error processing link count for ${dto.url}`,
      );
    }
  }

  async valuableBacklinkChecker(
    dto: ValuableBacklinkCheckerDto,
    apiKey: string,
  ) {
    const { url } = dto;

    const { data: html } = await axios.get(dto.url, {
      headers: {
        // Add headers to mimic a browser if needed
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
      },
      timeout: 10000, // 10 second timeout
    });

    const $ = cheerio.load(html);
    const links = new Set<string>();

    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('http') && !href.includes(url)) {
        links.add(href);
      }
    });

    const backlinks = Array.from(links).slice(0, 3);

    const vendor = AIVendorFactory.createVendor(dto.vendor ?? 'gemini');
    const prompt = `
  You are an SEO expert. Analyze the following list of backlinks and classify them based on:
  
  - Domain Authority (0–100)
  - Page Authority (0–100)
  - Trust Flow & Citation Flow (0–100)
  - Traffic score (0–100)
  - Relevance (0–100)
  - DoFollow status
  - Label each as "valuable", "moderate", or "low-value"
  
  Return this JSON:
  {
    totalBacklinks: number,
    valuableBacklinks: number,
    backlinksAnalyzed: [
      {
        url: string,
        domain: string,
        domainAuthority: number,
        pageAuthority: number,
        doFollow: boolean,
        status: "valuable" | "moderate" | "low-value",
        metrics: {
          traffic: number,
          relevance: number,
          trustFlow: number,
          citationFlow: number
        }
      }
    ],
    summary: {
      valuableCount: number,
      moderateCount: number,
      lowValueCount: number,
      doFollowCount: number,
      noFollowCount: number,
      averageDomainAuthority: number
    }
  }
  
  Backlink URLs: ${JSON.stringify(backlinks)}
  `;

    const response = await vendor.ask({
      prompt,
      api_key: apiKey,
      ...(dto?.model ? { model: dto.model } : {}),
    });

    const { data, error } = await tryCatch(() => outputParser(response));
    if (error) throw new Error('Failed to check keyword competition');

    return data;
  }
}
