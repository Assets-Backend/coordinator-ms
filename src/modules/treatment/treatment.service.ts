import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateTreatmentDto, UpdateTreatmentDto } from './dto';
import { Prisma, PrismaClient, treatment } from '@prisma/client';
import { ClientIds } from 'src/common/interface/client-ids.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TreatmentService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('TreatmentService');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    async create(currentClient: ClientIds, params: {
        client_updated_by: Prisma.clientWhereUniqueInput,
        data: Prisma.treatmentCreateInput
    }): Promise<treatment> { 

        const { client_updated_by, data } = params

        data.client = { connect: currentClient }
        data.client_updated_by = { connect: client_updated_by }

        try {

            return await this.treatment.create({ data })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async findOneByUnique(currentClient: ClientIds, params: {
        treatmentWhereUniqueInput: Prisma.treatmentWhereUniqueInput,
        select?: Prisma.treatmentSelect
    }): Promise<treatment> {

        const {treatmentWhereUniqueInput: where, select} = params

        where.client = currentClient

        try {
            
            return await this.treatment.findUniqueOrThrow({ where, select })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
    
    async findAll(currentClient: ClientIds, params?: {
        whereInput: Prisma.treatmentWhereInput,
        select?: Prisma.treatmentSelect,
        skip?: Prisma.treatmentFindManyArgs['skip'],
        take?: Prisma.treatmentFindManyArgs['take'],
    }): Promise<treatment[]> {

        const { whereInput: where, select, skip, take } = params

        where.client = currentClient

        try {

            return await this.treatment.findMany({ where, select, skip, take })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async update(currentClient: ClientIds, params: {
        whereUniqueInput: Prisma.treatmentWhereUniqueInput,
        client_updated_by: Prisma.clientWhereUniqueInput,
        data: Prisma.treatmentUpdateInput,
    }): Promise<treatment> {

        const { whereUniqueInput: where, data, client_updated_by } = params

        where.client = currentClient
        data.client_updated_by = { connect: client_updated_by }

        try {

            return await this.treatment.update({ where, data })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async delete(currentClient: ClientIds, params: {
        whereUniqueInput: Prisma.treatmentWhereUniqueInput,
        client_updated_by: Prisma.clientWhereUniqueInput,
    }): Promise<treatment> {

        const { whereUniqueInput: where, client_updated_by } = params
        const { treatment_id } = where
        
        where.client = currentClient
        
        try {

            // Verifico que exista el paciente y que perteza al cliente
            const treatment = await this.treatment.findFirstOrThrow({ where })
            
            if (treatment.deleted_at) throw new RpcException({
                status: 404,
                message: 'La prestación ya ha sido eliminado'
            });

            return await this.treatment.update({
                where: { treatment_id: treatment_id as number },
                data: { 
                    deleted_at: new Date(), 
                    client_updated_by: { connect: client_updated_by }
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
