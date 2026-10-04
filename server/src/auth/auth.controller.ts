import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @UseGuards(ThrottlerGuard)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto.username, dto.password);
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 8 * 3600 * 1000,
    });
    return { username: result.username, role: result.role };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(200)
  me(@Req() req: any) {
    return { username: req.user.username, role: req.user.role };
  }

  @Post('logout')
  @HttpCode(201)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { ok: true };
  }
}
