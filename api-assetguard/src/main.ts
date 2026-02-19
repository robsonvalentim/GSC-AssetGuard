import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Lê a porta do .env ou usa 3000 como fallback
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`Servidor AssetGuard rodando na porta: ${port}`);
}
bootstrap();
