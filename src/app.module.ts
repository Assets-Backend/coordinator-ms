import { Module } from '@nestjs/common';
import { 
    ClientModule,
    PatientModule,
    CompanyModule,
    TreatmentModule,
    CompanyHasTreatmentModule,
    TreatmentHasProfessionalModule
} from './modules';

@Module({
    imports: [
        ClientModule,
        PatientModule,
        CompanyModule,
        TreatmentModule,
        CompanyHasTreatmentModule,
        TreatmentHasProfessionalModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
