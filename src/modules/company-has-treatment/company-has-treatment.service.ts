import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCompanyHasTreatmentDto, UpdateCompanyHasTreatmentDto } from './dto';
import { company_has_treatment, Prisma, PrismaClient } from '@prisma/client';
import { ClientIds } from 'src/common/interface/client-ids.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CompanyHasTreatmentService extends PrismaClient implements OnModuleInit {
  
    private readonly logger = new Logger('CompanyHasTreatmentService');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    async create(currentClient: ClientIds, params: {
        client_updated_by: Prisma.clientWhereUniqueInput,
        company_company_fk: Prisma.companyWhereUniqueInput,
        treatment_treatment_fk: Prisma.treatmentWhereUniqueInput,
        data: Prisma.company_has_treatmentCreateInput
    }): Promise<company_has_treatment> { 

        const { client_updated_by, company_company_fk, treatment_treatment_fk, data } = params

        data.client = { connect: currentClient }
        data.company = { connect: company_company_fk }
        data.treatment = { connect: treatment_treatment_fk }
        data.client_updated_by = { connect: client_updated_by }

        try {

            return await this.company_has_treatment.create({ data })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async findOneByUnique(currentClient: ClientIds, params: {
        companyHasTreatmentWhereUniqueInput: Prisma.company_has_treatmentWhereUniqueInput,
        select?: Prisma.company_has_treatmentSelect
    }): Promise<company_has_treatment> {

        const {companyHasTreatmentWhereUniqueInput: where, select} = params
        const { client_id } = currentClient

        where.client = currentClient
        where.client_fk_company_fk_treatment_fk.client_fk = client_id

        try {
            
            return await this.company_has_treatment.findUniqueOrThrow({ where, select })

        } catch (error) {
            // console.log(error)
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
    
    async findAll(currentClient: ClientIds, params?: {
        companyHasTreatmentWhereInput: Prisma.company_has_treatmentWhereInput,
        select?: Prisma.company_has_treatmentSelect,
        skip?: Prisma.company_has_treatmentFindManyArgs['skip'],
        take?: Prisma.company_has_treatmentFindManyArgs['take'],
    }): Promise<company_has_treatment[]> {

        const { companyHasTreatmentWhereInput: where, select, skip, take } = params

        where.client = currentClient

        try {

            return await this.company_has_treatment.findMany({ where, select, skip, take })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async update(currentClient: ClientIds, params: {
        companyHasTreatmentWhereUniqueInput: Prisma.company_has_treatmentWhereUniqueInput,
        client_updated_by: Prisma.clientWhereUniqueInput,
        data: Prisma.company_has_treatmentUpdateInput,
    }): Promise<company_has_treatment> {

        const { companyHasTreatmentWhereUniqueInput: where, data, client_updated_by } = params
        const { client_id } = currentClient

        where.client = currentClient
        where.client_fk_company_fk_treatment_fk.client_fk = client_id
        data.client_updated_by = { connect: client_updated_by }

        try {

            return await this.company_has_treatment.update({ where, data })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async delete(currentClient: ClientIds, params: {
        companyHasTreatmentWhereUniqueInput: Prisma.company_has_treatmentWhereUniqueInput
    }): Promise<company_has_treatment> {

        const { companyHasTreatmentWhereUniqueInput: where } = params
        const { client_id } = currentClient
        
        where.client = currentClient
        where.client_fk_company_fk_treatment_fk.client_fk = client_id
        
        try {

            // Verifico que exista el paciente y que perteza al cliente
            await this.company_has_treatment.findUniqueOrThrow({ where }) 
            
            return await this.company_has_treatment.delete({ where }) 

        } catch (error) {
            console.log(error)
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
}
