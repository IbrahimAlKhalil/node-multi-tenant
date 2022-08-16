async function bootstrap() {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };

  const { NestFactory } = await import('@nestjs/core');
  const { AppModule } = await import('./app.module.js');

  const app = await NestFactory.createApplicationContext(AppModule);

  app.enableShutdownHooks();
}

bootstrap();
