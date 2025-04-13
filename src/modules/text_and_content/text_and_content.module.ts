import { Module } from '@nestjs/common';
import { TextAndContentController } from './text_and_content.controller';
import { TextAndContentService } from './text_and_content.service';
import { GeminiApiService } from '@app/common/vendor_apis';

@Module({
  controllers: [TextAndContentController],
  providers: [TextAndContentService, GeminiApiService],
  exports: [TextAndContentService],
})
export class TextAndContentModule {}
