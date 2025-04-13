import { Module } from '@nestjs/common';
import { TextAndContentController } from './text_and_content.controller';
import { TextAndContentService } from './text_and_content.service';

@Module({
  controllers: [TextAndContentController],
  providers: [TextAndContentService],
  exports: [TextAndContentService],
})
export class TextAndContentModule {}
