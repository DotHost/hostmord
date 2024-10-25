import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common';
import { CustomLoggerService } from './config/logger/logger.service';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get configurations
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000); // Default to 3000
  const productionUrl = configService.get<string>('PRODUCTION_URL');
  const platform = configService.get<string>('PLATFORM_NAME');
  const logger = app.get(CustomLoggerService);

  // Enable security features
  app.use(helmet());

  // Rate limiting to prevent abuse
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // CORS settings
  const allowedOrigins = [productionUrl, `http://localhost:${port}`];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: 'GET,PATCH,POST,PUT,DELETE',
  });

  // JSON body limit
  app.use(express.json({ limit: '10kb' })); // Set a reasonable limit

  // Global filters and pipes
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
    }),
  );

  // Swagger configuration
  const swaggerOptions = new DocumentBuilder()
    .setTitle(`${platform} API`)
    .setDescription(`API Documentation for ${platform} API`)
    .setVersion('1.0.0')
    .addServer(`http://localhost:${port}`, 'Local environment')
    .addServer(productionUrl, 'Production environment')
    .addBearerAuth(
      { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' },
      'Authorization',
    )
    .addTag('Server', 'Endpoint for Server functions')
    .addTag('Auth', 'Endpoint for Auth functions')
    .addTag('Users', 'Endpoint for users functions')
    .addTag('Hosting Plans', 'Endpoint for hosting plans functions')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);

  // Setup Swagger at /docs
  SwaggerModule.setup('docs', app, swaggerDocument, {
    customSiteTitle: `${platform} API`,
    swaggerOptions: {
      //defaultModelsExpandDepth: -1, // Hides the schema/model section
      //docExpansion: 'none', // Collapses the sections by default
    },
    customCss: '.swagger-ui .topbar { display: none }', // Hides Swagger top bar
  });

  // Start the server
  try {
    await app.listen(port);
    console.log(`Server is running at http://localhost:${port}`);
  } catch (err) {
    logger.error('Error starting the server:', err); // Use logger instead of console.error
  }
}

bootstrap();
