import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RazorpayConfig } from '../../config/razorpay.config';
import { RazorpayService } from './razorpay.service';

@Global()
@Module({})
export class RazorpayModule {
  static forRootAsync(): DynamicModule {
    return {
      module: RazorpayModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: RazorpayService,
          useFactory: (configService: ConfigService) => {
            const razorpayConfig = configService.get<RazorpayConfig>('razorpay');
            if (!razorpayConfig) {
              throw new Error('Razorpay configuration not found');
            }
            return new RazorpayService(razorpayConfig);
          },
          inject: [ConfigService],
        },
      ],
      exports: [RazorpayService],
    };
  }
}