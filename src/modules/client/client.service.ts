import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Prisma, PrismaClient, client } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../../common/dto';
import { ClientIds } from 'src/common/interface/client-ids.interface';

@Injectable()
export class ClientService extends PrismaClient implements OnModuleInit{

    private readonly logger = new Logger('ClientService');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    async findOneByUnique(currentClient: ClientIds, params: {
        clientWhereUniqueInput: Prisma.clientWhereUniqueInput,
        select?: Prisma.clientSelect
    }): Promise<client> {

        const {clientWhereUniqueInput: where, select} = params ?? {}

        currentClient.client_id != where.client_id ? where.client = currentClient : null 

        try {
            
            return await this.client.findUniqueOrThrow({ where, select })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async findAll(currentClient: ClientIds, params: {
        whereInput: Prisma.clientWhereInput,
        select?: Prisma.clientSelect,
        skip?: Prisma.clientFindManyArgs['skip'],
        take?: Prisma.clientFindManyArgs['take'],
    }): Promise<client[]> {

        const { whereInput: where, select, skip, take } = params

        where.client = currentClient

        try {

            return await this.client.findMany({ where, select, skip, take })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async update(currentClient: ClientIds, params: {
        whereUniqueInput?: Prisma.clientWhereUniqueInput, 
        data: Prisma.clientUpdateInput,
    }): Promise<client> {

        const { whereUniqueInput: where = {} as Prisma.clientWhereUniqueInput, data } = params

        params.whereUniqueInput ? where.client = currentClient : where.client_id = currentClient.client_id

        try {

            return await this.client.update({ where, data })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async delete(currentClient: ClientIds, params: {
        client_id: Prisma.clientWhereInput['client_id']
    }): Promise<client> {

        const { client_id } = params

        try {

            // Verifico que exista el usuario y que perteza al cliente
            const client = await this.client.findFirstOrThrow({
                where: {
                    client: currentClient,
                    client_id,
                },
            })
            
            if (!client.client_fk) throw new RpcException({
                status: 403,
                message: 'No se puede eliminar un usuario administrador'
            });

            if (client.deleted_at) throw new RpcException({
                status: 404,
                message: 'El usuario ya ha sido eliminado'
            });

            return await this.client.update({
                where: { client_id: client_id as number },
                data: { deleted_at: new Date() }
            }) 

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
}
