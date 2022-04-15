import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { MemberService } from '../member/member.service';
import { SmsService } from '../sms/sms.service';
import { Member } from '../member/members.schema';
import { AuthCode, AuthCodeDocument } from './auth-code.schema';
import { JwtPayload, JwtToken } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthCode.name)
    private readonly authCodeModel: mongoose.Model<AuthCodeDocument>,
    private readonly memberService: MemberService,
    private readonly smsService: SmsService,
    private readonly jwtService: JwtService,
  ) {}

  async sendAuthenticationCode(phoneNumber: string): Promise<string> {
    try {
      let authCode = (await this.authCodeModel.find({ phoneNumber }))[0];

      if (!authCode) {
        authCode = new this.authCodeModel({
          phoneNumber,
        });

        authCode = await authCode.save();
      }

      const reqId = authCode.id;
      const pin = authCode.pin;

      await this.smsService.sendAuthenticationCode({
        text: `your authentication code: ${pin}`,
        to: phoneNumber,
      });

      return reqId; // registration request id
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async verifyAuthenticationCode(
    reqId: string,
    pin: string,
    phoneNumber: string,
  ): Promise<string> {
    const authCode = await this.authCodeModel.findById(reqId);

    if (!authCode || authCode.phoneNumber !== phoneNumber) {
      throw new BadRequestException(
        'pin you entered does not exist on database or expired',
      );
    }

    if (pin === authCode.pin) {
      await this.memberService.findByPhoneNumberAndUpdate(
        authCode.phoneNumber,
        {
          verifyPhoneNumber: true,
        },
      );

      return authCode.phoneNumber;
    }

    throw new BadRequestException('pin you entered is wrong');
  }

  async registerMember(data: any) {
    try {
      let member = await this.memberService.findByPhoneNumber(data.phoneNumber);

      if (!member) {
        member = await this.memberService.create(data);
      }

      return member;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  login(member: Member, phoneNumber?: string): JwtToken {
    let payload: JwtPayload;

    if (!member.phoneNumber) {
      payload = { sub: phoneNumber };
    }

    payload = { sub: member.phoneNumber };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findByPhoneNumber(phoneNumber: string) {
    return await this.memberService.findByPhoneNumber(phoneNumber);
  }
}
