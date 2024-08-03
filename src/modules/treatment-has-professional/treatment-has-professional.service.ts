import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateTreatmentHasProfessionalDto, UpdateTreatmentHasProfessionalDto, CompositeIdDto } from './dto';
import { Prisma, PrismaClient, treatment_has_professional } from '@prisma/client';
import { ClientIds } from 'src/common/interface/client-ids.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TreatmentHasProfessionalService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('TratmentHasProfessionalService');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    async findOneByUnique(currentClient: ClientIds, params: {
        treatmentHasProfessionalmentWhereUniqueInput: Prisma.treatment_has_professionalWhereUniqueInput,
        select?: Prisma.treatment_has_professionalSelect
    }): Promise<treatment_has_professional> {

        const {treatmentHasProfessionalmentWhereUniqueInput: where, select} = params
        const { client_id } = currentClient

        where.client = currentClient
        where.client_fk_professional_fk_company_fk_treatment_fk.client_fk = client_id

        try {
            
            return await this.treatment_has_professional.findUniqueOrThrow({ where, select })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
    
    async findAll(currentClient: ClientIds, params?: {
        treatmentHasProfessionalmentWhereInput: Prisma.treatment_has_professionalWhereInput,
        select?: Prisma.treatment_has_professionalSelect,
        skip?: Prisma.treatment_has_professionalFindManyArgs['skip'],
        take?: Prisma.treatment_has_professionalFindManyArgs['take'],
    }): Promise<treatment_has_professional[]> {

        const { treatmentHasProfessionalmentWhereInput: where, select, skip, take } = params

        where.client = currentClient

        try {

            return await this.treatment_has_professional.findMany({ where, select, skip, take })

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async update(currentClient: ClientIds, params: {
        treatmentHasProfessionalmentWhereUniqueInput: Prisma.treatment_has_professionalWhereUniqueInput,
        client_updated_by: Prisma.clientWhereUniqueInput,
        data: Prisma.treatment_has_professionalUpdateInput,
    }): Promise<treatment_has_professional> {

        const { treatmentHasProfessionalmentWhereUniqueInput: where, data, client_updated_by } = params
        const { client_id } = currentClient

        where.client = currentClient
        where.client_fk_professional_fk_company_fk_treatment_fk.client_fk = client_id
        data.client_updated_by = { connect: client_updated_by }

        try {

            return await this.treatment_has_professional.update({ where, data })

        } catch (error) {
            console.log(error)
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async delete(currentClient: ClientIds, params: {
        treatmentHasProfessionalmentWhereUniqueInput: Prisma.treatment_has_professionalWhereUniqueInput
    }): Promise<treatment_has_professional> {

        const { treatmentHasProfessionalmentWhereUniqueInput: where } = params
        const { client_id } = currentClient
        
        where.client = currentClient
        where.client_fk_professional_fk_company_fk_treatment_fk.client_fk = client_id
        
        try {

            // Verifico que exista el paciente y que perteza al cliente
            await this.treatment_has_professional.findUniqueOrThrow({ where }) 
            
            return await this.treatment_has_professional.delete({ where }) 

        } catch (error) {
            console.log(error)
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
}
