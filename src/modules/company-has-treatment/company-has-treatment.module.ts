import { Module } from '@nestjs/common';
import { CompanyHasTreatmentService } from './company-has-treatment.service';
import { CompanyHasTreatmentController } from './company-has-treatment.controller';

@Module({
  controllers: [CompanyHasTreatmentController],
  providers: [CompanyHasTreatmentService],
})
export class CompanyHasTreatmentModule {}
