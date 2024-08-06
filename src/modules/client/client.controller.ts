import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClientService } from './client.service';
import { CompositeIdDto, CreateClientDto, UpdateClientDto } from './dto';
import { client } from '@prisma/client';
import { PaginationDto } from 'src/common/dto'
import { CurrentClient } from 'src/common/decorators/current-client.decorator';
import { ClientIds } from 'src/common/interface/client-ids.interface';

@Controller()
export class ClientController {
    
	constructor(private readonly clientService: ClientService) {}

	@MessagePattern('coordinator.find.user')
	findOne(
        @CurrentClient() currentClient: ClientIds,
        @Payload('user_id') client_id: number
	): Promise<client> {
		return this.clientService.findOneByUnique(currentClient, {
            clientWhereUniqueInput: { client_id }
        });
	}

    @MessagePattern('coordinator.validate.coordinator')
	validate(
        @CurrentClient() currentClient: ClientIds,
        @Payload('compositeIdDto') compositeIdDto: CompositeIdDto
	): Promise<boolean> {
		return this.clientService.validate(currentClient, { compositeIdDto });
	}

    @MessagePattern('coordinator.find.users')
	findAll(
        @CurrentClient() currentClient: ClientIds,
	    @Payload('paginationDto') paginationDto: PaginationDto
	): Promise<client[]> {

        const { limit: take, offset: skip } = paginationDto

        return this.clientService.findAll(currentClient, {
            whereInput: { deleted_at: null },
            skip,
            take
        })
	}

    @MessagePattern('coordinator.update.user')
	update(
        @CurrentClient() currentClient: ClientIds,
	    @Payload('updateClientDto') updateClientDto: UpdateClientDto
	): Promise<client> {

        return this.clientService.update(currentClient, {
            data: updateClientDto
        })
	}

    @MessagePattern('coordinator.delete.user')
	delete(
        @CurrentClient() currentClient: ClientIds,
	    @Payload('user_id') user_id: number
	): Promise<client> {

        return this.clientService.delete(currentClient, {
            client_id: user_id
        })
	}
}
