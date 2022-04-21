import cluster from 'cluster';

async function bootstrap() {
  const { NestFactory } = await import('@nestjs/core');
  const { AppModule } = await import('./app.module.js');

  await NestFactory.createApplicationContext(AppModule);
}

if (cluster.isPrimary && process.env.NODE_ENV === 'development') {
  for (let i = 0; i < 2; i++) {
    cluster.fork();
  }
} else {
  bootstrap();
}
