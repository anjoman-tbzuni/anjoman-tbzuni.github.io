import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from './sms.constants';
import { SmsModuleOptions } from './sms.interfaces';
import { SmsService } from './sms.service';

@Module({})
@Global()
export class SmsModule {
  static register(options: SmsModuleOptions): DynamicModule {
    return {
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        SmsService,
      ],
      exports: [SmsService],
      module: SmsModule,
    };
  }
}
