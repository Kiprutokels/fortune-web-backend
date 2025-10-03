import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiResponse } from '../common/interfaces/response.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ApiResponse> {
    try {
      const { email, password } = loginDto;

      const admin = await this.prisma.admin.findUnique({
        where: { email },
      });

      if (!admin) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { adminId: admin.id, email: admin.email };
      const token = this.jwtService.sign(payload);

      return {
        success: true,
        message: 'Login successful',
        data: {
          token,
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Login failed');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ApiResponse> {
    try {
      const { email, newPassword } = resetPasswordDto;

      const admin = await this.prisma.admin.findUnique({
        where: { email },
      });

      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await this.prisma.admin.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Password reset failed');
    }
  }
}
