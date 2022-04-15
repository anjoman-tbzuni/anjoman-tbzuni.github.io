import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  async register(@Body() data: Record<string, unknown>) {
    const member = await this.authService.registerMember(data);
    return this.authService.login(member);
  }

  @Get()
  me(@Req() req: Request) {
    const member = this.authService.findByPhoneNumber(req.user.phoneNumber);
    return member;
  }

  @Get('/verify')
  async sendAuthenticationCode(
    @Req() req: Request,
  ): Promise<{ reqId: string }> {
    const reqId = await this.authService.sendAuthenticationCode(
      req.user.phoneNumber,
    );
    return { reqId };
  }

  @Post('/verify')
  async verifyMember(@Req() req: Request, @Body() body: any) {
    await this.authService.verifyAuthenticationCode(
      body.reqId,
      body.pin,
      req.user.phoneNumber,
    );

    return this.authService.findByPhoneNumber(req.user.phoneNumber);
  }
}
