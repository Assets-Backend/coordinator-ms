import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreatePatientDto, UpdatePatientDto } from './dto';
import { company, patient, Prisma, PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { ClientIds } from 'src/common/interface/client-ids.interface';

@Injectable()
export class PatientService extends PrismaClient implements OnModuleInit{

    private readonly logger = new Logger('PatientService');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    async create(currentClient: ClientIds, params: {
        client_updated_by: Prisma.clientWhereUniqueInput,
        company_company_fk: Prisma.companyWhereUniqueInput,
        data: Prisma.patientCreateInput
    }): Promise<patient> { 

        const { client_updated_by, company_company_fk, data } = params

        data.client = { connect: currentClient }
        data.company = { connect: company_company_fk }
        data.client_updated_by = { connect: client_updated_by }

        try {

            return await this.patient.create({ data })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async findOneByUnique(currentClient: ClientIds, params: {
        patientWhereUniqueInput: Prisma.patientWhereUniqueInput,
        select?: Prisma.patientSelect
    }): Promise<patient> {

        const {patientWhereUniqueInput: where, select} = params

        where.client = currentClient

        try {
            
            return await this.patient.findUniqueOrThrow({ where, select })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async findByCompany(currentClient: ClientIds, params: {
        patientWhereInput: Prisma.patientWhereInput,
        select?: Prisma.patientSelect,
        skip?: Prisma.patientFindManyArgs['skip'],
        take?: Prisma.patientFindManyArgs['take'],
    }): Promise<patient[]> {

        const { patientWhereInput: where, select, skip, take } = params

        where.client = currentClient

        try {
            
            return await this.patient.findMany({ where, select, skip, take })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
    
    async findAll(currentClient: ClientIds, params?: {
        patientWhereInput: Prisma.patientWhereInput,
        select?: Prisma.patientSelect,
        skip?: Prisma.patientFindManyArgs['skip'],
        take?: Prisma.patientFindManyArgs['take'],
    }): Promise<patient[]> {

        const { patientWhereInput: where, select, skip, take } = params

        where.client = currentClient

        try {

            return await this.patient.findMany({ where, select, skip, take })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async update(currentClient: ClientIds, params: {
        whereUniqueInput: Prisma.patientWhereUniqueInput,
        client_updated_by: Prisma.clientWhereUniqueInput,
        data: Prisma.patientUpdateInput,
    }): Promise<patient> {

        const { whereUniqueInput: where, data, client_updated_by } = params

        where.client = currentClient
        data.client_updated_by = { connect: client_updated_by }

        try {

            return await this.patient.update({ where, data })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async delete(currentClient: ClientIds, params: {
        whereUniqueInput: Prisma.patientWhereUniqueInput,
        client_updated_by: Prisma.clientWhereUniqueInput,
    }): Promise<patient> {

        const { whereUniqueInput: where, client_updated_by } = params
        const { patient_id } = where
        
        where.client = currentClient
        
        try {

            // Verifico que exista el paciente y que perteza al cliente
            const patient = await this.patient.findFirstOrThrow({ where })
            
            if (patient.deleted_at) throw new RpcException({
                status: 404,
                message: 'El paciente ya ha sido eliminado'
            });

            return await this.patient.update({
                where: { patient_id: patient_id as number },
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

    async countPatientsByCompany(params: {
        company_id: company['company_id']
    }): Promise<number> {

        const { company_id } = params

        try {

            return await this.patient.count({
                where: { company_fk: company_id }
            });

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
}
