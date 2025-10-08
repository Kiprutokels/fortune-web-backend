import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from '../common/decorators/public.decorator';
import { ApiErrorResponses } from '../common/decorators/api-response.decorator';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ 
    summary: 'Admin login',
    description: 'Authenticate admin user and receive JWT token for API access'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful - Returns JWT token and user info',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Login successful' },
        data: {
          type: 'object',
          properties: {
            access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'admin-123' },
                email: { type: 'string', example: 'admin@fortune.com' },
                role: { type: 'string', example: 'admin' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials - Email or password is incorrect',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Invalid credentials' },
        statusCode: { type: 'number', example: 401 }
      }
    }
  })
  @ApiErrorResponses()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ 
    summary: 'Reset admin password',
    description: 'Reset admin password using email address. Sends reset instructions to the provided email.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset instructions sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Password reset instructions sent to your email' },
        data: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'admin@fortune.com' },
            resetToken: { type: 'string', example: 'reset-token-123' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found - Email address does not exist in the system',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Admin not found' },
        statusCode: { type: 'number', example: 404 }
      }
    }
  })
  @ApiErrorResponses()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
