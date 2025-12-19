import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix
  app.setGlobalPrefix("api");

  // Global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Enable CORS for frontend
  app.enableCors();

  await app.listen(process.env.PORT ?? 8000);
  console.log(`🚀 API Server running on http://localhost:${process.env.PORT ?? 8000}/api`);
}
bootstrap();
