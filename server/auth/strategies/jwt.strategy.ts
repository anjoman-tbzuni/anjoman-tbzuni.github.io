import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserLogin } from '../interfaces/user-login.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserLogin> {
    const { sub } = payload;
    const member = await this.authService.findByPhoneNumber(sub);

    if (!member) {
      throw new NotFoundException('user does not exist on database');
    }

    // const { id, role, defaultAddress } = user;
    // return { id, role, defaultAddress };
    return {
      phoneNumber: member.phoneNumber,
    };
  }
}
