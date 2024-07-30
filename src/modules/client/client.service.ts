import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Prisma, PrismaClient, client } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../../common/dto';

@Injectable()
export class ClientService extends PrismaClient implements OnModuleInit{

    private readonly logger = new Logger('ClientService');

    constructor() {
        super();
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    async findOneByUnique(params: {
        clientWhereUniqueInput: Prisma.clientWhereUniqueInput,
        select?: Prisma.clientSelect
    }): Promise<client> {

        const {clientWhereUniqueInput, select} = params

        try {
            
            return await this.client.findUniqueOrThrow({
                where: clientWhereUniqueInput,
                select
            })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async findAll(params: {
        where: Prisma.clientWhereInput,
        select?: Prisma.clientSelect,
        skip?: Prisma.clientFindManyArgs['skip'],
        take?: Prisma.clientFindManyArgs['take'],
    }): Promise<client[]> {

        const { where, select, skip, take } = params

        try {

            return await this.client.findMany({
                where,
                select,
                skip,
                take
            })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async delete(params: {
        where: Prisma.clientWhereInput,
        client_id: Prisma.clientWhereInput['client_id']
    }): Promise<client> {

        const { where, client_id } = params

        try {

            // Verifico que exista el usuario y que perteza al cliente
            const client = await this.client.findFirstOrThrow({
                where: {
                    ...where,
                    client_id,
                },
            })
            
            if (!client.client_fk)
                throw new RpcException({
                    status: 403,
                    message: 'No se puede eliminar un usuario administrador'
                });

            if (client.deleted_at)
                throw new RpcException({
                    status: 404,
                    message: 'El usuario ya ha sido eliminado'
                });

            return await this.client.update({
                where: {
                    client_id: client_id as number
                },
                data: {
                    deleted_at: new Date()
                }
            }) 

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
}
