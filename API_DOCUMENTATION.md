# Fortune Technologies CMS API Documentation

## Overview

The Fortune Technologies CMS API provides a comprehensive content management system for the Fortune Technologies website. This RESTful API enables both public access to website content and administrative management of all website elements.

## Base URL

```
http://localhost:3000/api
```

## Authentication

The API uses JWT (JSON Web Token) authentication for admin endpoints. Most admin operations require a valid Bearer token.

### Getting Started

1. **Login** to get your JWT token:
   ```bash
   POST /api/auth/login
   ```

2. **Use the token** in subsequent requests:
   ```bash
   Authorization: Bearer <your-jwt-token>
   ```

## API Endpoints

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Admin login | No |
| POST | `/auth/reset-password` | Reset admin password | No |

### 🌐 Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/navigation` | Get website navigation | No |
| GET | `/hero` | Get hero section data | No |
| GET | `/services` | Get all active services | No |
| GET | `/services/:slug` | Get service by slug | No |
| GET | `/stats` | Get all active stats | No |
| GET | `/testimonials` | Get all active testimonials | No |
| GET | `/footer` | Get complete footer content | No |
| GET | `/contact-info` | Get contact information | No |
| GET | `/social-links` | Get social media links | No |
| GET | `/page-content/:pageKey` | Get page-specific content | No |
| GET | `/call-to-actions/:pageKey` | Get CTAs for specific page | No |
| GET | `/section-content/:sectionKey` | Get section content by key | No |
| POST | `/consultation` | Submit consultation request | No |

### 👨‍💼 Admin Endpoints

#### File Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/admin/upload` | Upload file for admin use | Yes |
| DELETE | `/admin/uploads/:id` | Delete uploaded file | Yes |

#### Content Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| PUT | `/admin/navigation` | Update website navigation | Yes |
| DELETE | `/admin/navigation/:id` | Delete navigation item | Yes |
| PUT | `/admin/theme` | Update website theme | Yes |
| PUT | `/admin/hero-dashboards` | Update hero dashboard slides | Yes |
| PUT | `/admin/hero-content` | Update hero section content | Yes |
| PUT | `/admin/services` | Update all services | Yes |
| DELETE | `/admin/services/:id` | Delete a service | Yes |
| PUT | `/admin/testimonials` | Update all testimonials | Yes |
| DELETE | `/admin/testimonials/:id` | Delete a testimonial | Yes |
| PUT | `/admin/stats` | Update all stats | Yes |
| DELETE | `/admin/stats/:id` | Delete a stat | Yes |
| PUT | `/admin/section-content` | Update section content | Yes |
| PUT | `/admin/footer` | Update footer sections | Yes |
| GET | `/admin/footer` | Get footer content for admin | Yes |
| PUT | `/admin/contact-info` | Update contact information | Yes |
| GET | `/admin/contact-info` | Get contact info for admin | Yes |
| PUT | `/admin/social-links` | Update social media links | Yes |
| GET | `/admin/social-links` | Get social links for admin | Yes |
| PUT | `/admin/page-content` | Update page-specific content | Yes |
| GET | `/admin/page-content/:pageKey` | Get page content for admin | Yes |
| PUT | `/admin/call-to-actions` | Update call-to-action sections | Yes |
| GET | `/admin/call-to-actions/:pageKey` | Get CTAs for specific page | Yes |

#### Consultation Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/consultations` | Get all consultation requests | Yes |
| PUT | `/admin/consultations/:id/status` | Update consultation status | Yes |
| GET | `/admin/consultation-form-config` | Get consultation form config | Yes |
| PUT | `/admin/consultation-form-config` | Update consultation form config | Yes |

### 📁 File Upload Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload` | Upload a file | Yes |
| GET | `/upload` | List uploaded files | Yes |
| GET | `/upload/:id` | Get file info | Yes |
| DELETE | `/upload/:id` | Delete a file | Yes |
| GET | `/uploads/:filename` | Serve uploaded file | No |

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/endpoint"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "VALIDATION_ERROR",
  "statusCode": 400,
  "validationErrors": [
    {
      "field": "email",
      "message": "email must be a valid email"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/endpoint"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource does not exist |
| 500 | Internal Server Error - Server error |

## Rate Limiting

API requests are rate-limited to ensure optimal performance. Contact support if you need higher limits.

## File Upload

### Supported File Types
- Images: JPG, PNG, GIF, WebP, SVG
- Documents: PDF, DOC, DOCX, TXT
- Media: MP4, MP3, WAV

### File Size Limits
- Maximum file size: 10MB
- Recommended image size: < 2MB

## Error Handling

The API provides detailed error messages to help with debugging:

- **400 Bad Request**: Check your request data and validation errors
- **401 Unauthorized**: Ensure you have a valid JWT token
- **403 Forbidden**: Check if you have the required permissions
- **404 Not Found**: Verify the endpoint URL and resource ID
- **500 Internal Server Error**: Contact support with the error details

## Swagger Documentation

Interactive API documentation is available at:
```
http://localhost:3000/api-docs
```

## Support

For API support or questions:
- Email: support@fortunetechnologies.com
- Website: https://fortunetechnologies.com

## Changelog

### Version 1.0.0
- Initial API release
- Complete CRUD operations for all content types
- JWT authentication
- File upload system
- Public API endpoints
- Admin management interface
