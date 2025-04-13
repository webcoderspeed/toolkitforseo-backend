import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { APP_PORT, DEV_ORIGINS, PROD_ORIGINS } from '@app/common/constants';
import {
  corsOptions,
  ErrorExceptionFilter,
  ResponseInterceptor,
  ValidationPipe,
} from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new ErrorExceptionFilter());

  const devOrigins = configService.getOrThrow<string>(DEV_ORIGINS);
  const prodOrigins = configService.getOrThrow<string>(PROD_ORIGINS);

  app.enableCors(
    process.env.NODE_ENV === 'development'
      ? corsOptions(devOrigins)
      : corsOptions(prodOrigins),
  );

  await app.listen(configService.getOrThrow(APP_PORT));
}
bootstrap();
