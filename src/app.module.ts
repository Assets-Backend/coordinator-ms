import { Module } from '@nestjs/common';
import { 
    ClientModule,
    PatientModule,
    CompanyModule,
    TreatmentModule
} from './modules';

@Module({
    imports: [
        ClientModule,
        PatientModule,
        CompanyModule,
        TreatmentModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
