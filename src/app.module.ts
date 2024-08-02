import { Module } from '@nestjs/common';
import { 
    ClientModule,
    PatientModule,
    CompanyModule
} from './modules';

@Module({
    imports: [
        ClientModule,
        PatientModule,
        CompanyModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
