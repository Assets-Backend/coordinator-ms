import { Module } from '@nestjs/common';
import { 
    ClientModule,
} from './modules';

@Module({
    imports: [
        ClientModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
