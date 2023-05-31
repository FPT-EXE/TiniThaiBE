import { Module } from '@nestjs/common';

import { AppConfigModule } from '../../application/configuration/config.module';

import { PaymentController } from './payment.controller';
import { VnPayService } from './vnpay.service';



@Module({
	imports: [AppConfigModule],
	controllers: [PaymentController],
	providers: [VnPayService],
})
export class PaymentModule {}
