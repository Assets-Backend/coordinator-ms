import { Module } from '@nestjs/common';
import { 
    ClientModule,
} from './modules';
import { PatientModule } from './modules/patient/patient.module';

@Module({
    imports: [
        ClientModule,
        PatientModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
