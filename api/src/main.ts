async function bootstrap() {
  const { NestFactory } = await import('@nestjs/core');
  const { AppModule } = await import('./app.module.js');

  await NestFactory.createApplicationContext(AppModule);
}

bootstrap();
