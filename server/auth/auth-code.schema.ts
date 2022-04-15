import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { customAlphabet } from 'nanoid';

export const randomString = customAlphabet('0123456789', 5);

@Schema({ timestamps: true })
export class AuthCode {
  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ default: randomString() })
  pin: string;

  @Prop({
    type: Date,
    default: Date.now,
    index: {
      expireAfterSeconds: 180,
    },
  })
  expiresIn: Date;
}

export type AuthCodeDocument = AuthCode & Document;

export const AuthCodeSchema = SchemaFactory.createForClass(AuthCode);
