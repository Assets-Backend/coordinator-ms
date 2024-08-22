import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateClientDto, UpdateClientDto } from './dto';
import { Prisma, PrismaClient, client } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../../common/dto';
import { ClientIds } from 'src/common/interface/client-ids.interface';
import { CompositeIdDto } from './dto';
import { NATS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('ClientService');

    constructor(
        @Inject(NATS_SERVICE) private readonly clientNats: ClientProxy
    ) {
        super();
    }  

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    async findOneByUnique(currentClient: ClientIds, params: {
        clientWhereUniqueInput: Prisma.clientWhereUniqueInput,
        select?: Prisma.clientSelect
    }): Promise<client> {

        const {clientWhereUniqueInput: where, select} = params

        if (currentClient.client_id !== where.client_id) where.client = currentClient

        try {
            return await this.client.findUniqueOrThrow({ where, select })
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
    
    async findByOrder(params: {
        client_id: number,
        order_fk: number
    }): Promise<any> {

        const {client_id, order_fk: order_id} = params

        try {

            const client = await this.client.findUniqueOrThrow({ where: { client_id } })
            const currentClient = { client_id, mongo_id: client.mongo_id }
    
            const { patient_fk: patient_id, company_fk: company_id, treatment_fk: treatment_id } = await firstValueFrom(
                this.clientNats.send('order.find.order', { currentClient, order_id })
            );
    
            // Patient
            const patient = await this.patient.findUniqueOrThrow({ where: { patient_id } })
    
            // Client
            const coordinator = await this.client.findUniqueOrThrow({ where: { client_id } })
    
            // Company
            const company = await this.company.findUniqueOrThrow({ where: { company_id } })
    
            // Treatment
            const treatment = await this.treatment.findUniqueOrThrow({ where: { treatment_id } })

            return {
                patient: patient.name + ' ' + patient.last_name,
                healthcare_provider: patient.healthcare_provider,
                age: patient.age,
                gender: patient.gender,
                company: company.name,
                client: coordinator.name + ' ' + coordinator.last_name,
                treatment: treatment.name,
                abbreviation: treatment.abbreviation
            }

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
        whereUniqueInput: Prisma.clientWhereUniqueInput,
        data: Prisma.clientUpdateInput,
    }): Promise<client> {

        const { whereUniqueInput: where, data} = params

        if (currentClient.client_id !== where.client_id) where.client = currentClient

        try {
            // TODO: actualizar el usuario en auth-ms

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

            // TODO: eliminar el usuario en auth-ms

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

    async validate(currentClient: ClientIds, params: {
        compositeIdDto: CompositeIdDto
    }): Promise<boolean> {

        // validar que existe el coordinador, tratamiento, paciente y empresa 
        // validar que el paciente pertenezca a la empresa

        const { compositeIdDto } = params
        const { company_fk, patient_fk, treatment_fk } = compositeIdDto

        const patient = await this.patient.findFirst({
            where: {
                client: currentClient,
                patient_id: patient_fk,
                company_fk,
                company: {
                    company_has_treatment: {
                        some: {
                            treatment_fk,
                        }
                    }
                }
            },
            select: { patient_id: true }
        })

        return patient ? true : false	
    }
}
