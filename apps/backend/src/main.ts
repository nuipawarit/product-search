import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL;
  if (frontendUrl) {
    app.enableCors({
      origin: frontendUrl,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
  }

  const port = process.env.PORT || 3000;
  app.setGlobalPrefix('api');
  await app.listen(port, () => {
    console.log(`NestJS server is running on port ${port}`);
  });
}

void bootstrap();
