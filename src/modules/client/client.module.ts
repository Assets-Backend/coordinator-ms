import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
