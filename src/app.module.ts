import { Module } from '@nestjs/common';
import { 
    CommonModule,
} from './modules';

@Module({
    imports: [
        CommonModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
