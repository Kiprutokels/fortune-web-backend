import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: configService.get('cors.origin'),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Fortune Technologies CMS API')
    .setDescription(`
      Complete Content Management System API for Fortune Technologies website.
      
      ## Features
      - **Authentication**: JWT-based admin authentication
      - **Content Management**: Dynamic content updates for all website sections
      - **File Upload**: Secure file upload and management
      - **Public API**: Public endpoints for website content
      - **Admin Panel**: Comprehensive admin interface for content management
      
      ## Authentication
      Most endpoints require Bearer token authentication. Use the login endpoint to get your token.
      
      ## Rate Limiting
      API requests are rate-limited to ensure optimal performance.
      
      ## Support
      For API support, contact the development team.
    `)
    .setVersion('1.0.0')
    .setContact('Fortune Technologies', 'https://fortunetechnologies.com', 'support@fortunetechnologies.com')
    .setLicense('Proprietary', 'https://fortunetechnologies.com/license')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Health', 'Health check and API information endpoints')
    .addTag('Authentication', 'Admin authentication endpoints')
    .addTag('Public', 'Public website content endpoints')
    .addTag('Admin', 'Admin content management endpoints')
    .addTag('File Upload', 'File upload and management endpoints')
    .addTag('Public - Hero', 'Hero section public endpoints')
    .addTag('Public - Navigation', 'Navigation public endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      showCommonExtensions: true,
    },
    customSiteTitle: 'Fortune Technologies API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2563eb }
    `,
  });

  const port = configService.get('port');
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${port}/api/health`);
}

bootstrap();
