import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    return {
      name: 'Fortune Technologies CMS API',
      version: '1.0.0',
      description: 'Content Management System API for Fortune Technologies website',
      documentation: '/api-docs',
      health: '/api/health',
    };
  }

  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
