import { Module } from '@nestjs/common';
import { 
    ClientModule,
    PatientModule,
    CompanyModule,
    TreatmentModule,
    CompanyHasTreatmentModule
} from './modules';

@Module({
    imports: [
        ClientModule,
        PatientModule,
        CompanyModule,
        TreatmentModule,
        CompanyHasTreatmentModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
