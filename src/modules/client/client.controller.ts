import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClientService } from './client.service';
import { CreateClientDto, UpdateClientDto } from './dto';
import { client } from '@prisma/client';
import { PaginationDto } from 'src/common/dto'

@Controller()
export class ClientController {
    
	constructor(private readonly clientService: ClientService) {}

	@MessagePattern('coordinator.find.user')
	Client(
		@Payload() user: {mongo_id: string, client_id: number}
	): Promise<client> {

        const { mongo_id, client_id } = user

		return this.clientService.findOneByUnique({
            clientWhereUniqueInput: {
                client_id,
                mongo_id
            }
        });
	}

    @MessagePattern('coordinator.find.users')
	findUsers(
	    @Payload() user: {mongo_id: string, client_id: number, paginationDto: PaginationDto}
	): Promise<client[]> {

        const { mongo_id, client_id, paginationDto: {limit: take, offset: skip} } = user

        return this.clientService.findAll({
            where: {
                client: {
                    client_id,
                    mongo_id
                },
                deleted_at: null
            },
            skip,
            take
        })
	}

    @MessagePattern('coordinator.delete.user')
	deleteUser(
	    @Payload() user: {mongo_id: string, client_id: number, user_id: number}
	): Promise<client> {

        const { mongo_id, client_id, user_id } = user

        return this.clientService.delete({
            where: {
                client: {
                    client_id,
                    mongo_id
                }
            },
            client_id: user_id
        })
	}
}
