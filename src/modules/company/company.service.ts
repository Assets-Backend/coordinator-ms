import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { company, Prisma, PrismaClient } from '@prisma/client';
import { ClientIds } from 'src/common/interface/client-ids.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CompanyService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('CompanyService');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    async create(currentClient: ClientIds, params: {
        client_updated_by: Prisma.clientWhereUniqueInput,
        data: Prisma.companyCreateInput
    }): Promise<company> { 

        const { client_updated_by, data } = params

        data.client = { connect: currentClient }
        data.client_updated_by = { connect: client_updated_by }

        try {

            return await this.company.create({ data })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async findOneByUnique(currentClient: ClientIds, params: {
        companyWhereUniqueInput: Prisma.companyWhereUniqueInput,
        select?: Prisma.companySelect
    }): Promise<company> {

        const {companyWhereUniqueInput: where, select} = params

        where.client = currentClient

        try {
            
            return await this.company.findUniqueOrThrow({ where, select })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
    
    async findAll(currentClient: ClientIds, params?: {
        companyWhereInput: Prisma.companyWhereInput,
        select?: Prisma.companySelect,
        skip?: Prisma.companyFindManyArgs['skip'],
        take?: Prisma.companyFindManyArgs['take'],
    }): Promise<company[]> {

        const { companyWhereInput: where, select, skip, take } = params

        where.client = currentClient

        try {

            return await this.company.findMany({ where, select, skip, take })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async update(currentClient: ClientIds, params: {
        whereUniqueInput: Prisma.companyWhereUniqueInput,
        client_updated_by: Prisma.clientWhereUniqueInput,
        data: Prisma.companyUpdateInput,
    }): Promise<company> {

        const { whereUniqueInput: where, data, client_updated_by } = params

        where.client = currentClient
        data.client_updated_by = { connect: client_updated_by }

        try {

            return await this.company.update({ where, data })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async delete(currentClient: ClientIds, params: {
        whereUniqueInput: Prisma.companyWhereUniqueInput,
        client_updated_by: Prisma.clientWhereUniqueInput,
    }): Promise<company> {

        const { whereUniqueInput: where, client_updated_by } = params
        const { company_id } = where
        
        where.client = currentClient
        
        try {

            // Verifico que exista el paciente y que perteza al cliente
            const company = await this.company.findFirstOrThrow({ where })
            
            if (company.deleted_at) throw new RpcException({
                status: 404,
                message: 'La empresa ya ha sido eliminado'
            });

            return await this.company.update({
                where: { company_id: company_id as number },
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
