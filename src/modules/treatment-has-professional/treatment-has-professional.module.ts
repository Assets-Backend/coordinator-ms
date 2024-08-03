import { Module } from '@nestjs/common';
import { TreatmentHasProfessionalService } from './treatment-has-professional.service';
import { TreatmentHasProfessionalController } from './treatment-has-professional.controller';

@Module({
  controllers: [TreatmentHasProfessionalController],
  providers: [TreatmentHasProfessionalService],
})
export class TreatmentHasProfessionalModule {}
