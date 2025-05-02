import { Controller, Post, Body, Headers } from '@nestjs/common';
import { BacklinkAnalysisService } from './backlink-analysis.service';
import {
  BacklinkCheckerDto,
  AnchorTextDistributionDto,
  WebsiteLinkCountCheckerDto,
  ValuableBacklinkCheckerDto,
} from './dtos';
import { X_API_KEY, X_TRACE_ID } from '@app/common';

@Controller('v1/backlink-analysis')
export class BacklinkAnalysisController {
  constructor(private readonly service: BacklinkAnalysisService) {}

  @Post('backlink-checker')
  async backlinkChecker(
    @Body() dto: BacklinkCheckerDto,
    @Headers(X_TRACE_ID) traceId: string,
    @Headers(X_API_KEY) apiKey: string,
  ) {
    return this.service.backlinkChecker(dto, apiKey);
  }

  @Post('anchor-text-distribution')
  async anchorTextDistribution(
    @Body() dto: AnchorTextDistributionDto,
    @Headers(X_TRACE_ID) traceId: string,
    @Headers(X_API_KEY) apiKey: string,
  ) {
    return this.service.anchorTextDistribution(dto, apiKey);
  }

  @Post('website-link-count-checker')
  async websiteLinkCountChecker(
    @Body() dto: WebsiteLinkCountCheckerDto,
    @Headers(X_TRACE_ID) traceId: string,
    @Headers(X_API_KEY) apiKey: string,
  ) {
    return this.service.websiteLinkCountChecker(dto, apiKey);
  }

  @Post('valuable-backlink-checker')
  async valuableBacklinkChecker(
    @Body() dto: ValuableBacklinkCheckerDto,
    @Headers(X_TRACE_ID) traceId: string,
    @Headers(X_API_KEY) apiKey: string,
  ) {
    return this.service.valuableBacklinkChecker(dto, apiKey);
  }
}
