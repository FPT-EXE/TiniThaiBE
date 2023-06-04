import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppConfigModule } from '../../application/configuration/config.module';
import { UsersModule } from '../users/users.module';

import { PaymentsController } from './payment.controller';
import { VnPayService } from './vnpay.service';
import { Payment, PaymentSchema } from './entities/payment.entity';


@Module({
	imports: [
		MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
		AppConfigModule,
		UsersModule
	],
	controllers: [PaymentsController],
	providers: [VnPayService],
})
export class PaymentModule {}
