import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PatientService } from './patient.service';
import { CreatePatientDto, UpdatePatientDto } from './dto';
import { ClientIds } from 'src/common/interface/client-ids.interface';
import { client, patient, Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { CurrentClient } from 'src/common/decorators/current-client.decorator';

@Controller()
export class PatientController {

    constructor(private readonly patientService: PatientService) {}

    @MessagePattern('coordinator.create.patient')
    create(
        @CurrentClient() currentClient: ClientIds,
        @Payload('createPatientDto') createPatientDto: CreatePatientDto,
    ): Promise<patient> {

        const { updated_by: client_id, company_fk: company_id, ...data }:any = createPatientDto

        return this.patientService.create(currentClient, {
            client_updated_by: { client_id },
            company_company_fk: { company_id },
            data
        })
    }

    @MessagePattern('coordinator.find.patient')
    findOne(
        @CurrentClient() currentClient: ClientIds,
        @Payload('patient_id') patient_id: number
    ): Promise<patient> {

        return this.patientService.findOneByUnique(currentClient, {
            patientWhereUniqueInput: {
                patient_id
            }
        });
    }

    @MessagePattern('coordinator.findByCompany.patient')
    findByCompany(
        @CurrentClient() currentClient: ClientIds,
        @Payload('company_fk') company_fk: number,
        @Payload('paginationDto') paginationDto: PaginationDto
    ): Promise<patient[]> {

        const { limit: take, offset: skip } = paginationDto

        return this.patientService.findByCompany(currentClient, {
            patientWhereInput: { company_fk },
            skip,
            take
        });
    }

    @MessagePattern('coordinator.find.patients')
    findAll(
        @CurrentClient() currentClient: ClientIds,
        @Payload('paginationDto') paginationDto: PaginationDto
    ): Promise<patient[]> {

        const { limit: take, offset: skip } = paginationDto

        return this.patientService.findAll(currentClient, {
            patientWhereInput: { deleted_at: null },
            skip,
            take
        })
    }

    @MessagePattern('coordinator.update.patient')
    update(
        @CurrentClient() currentClient: ClientIds,
        @Payload('updatePatientDto') updatePatientDto: UpdatePatientDto
    ): Promise<patient> {

        const { patient_id, updated_by: client_id, ...data } = updatePatientDto

        return this.patientService.update(currentClient, {
            whereUniqueInput: { patient_id },
            client_updated_by: { client_id },
            data,
        })
    }

    @MessagePattern('coordinator.delete.patient')
    delete(
        @CurrentClient() currentClient: ClientIds,
        @Payload('deletePatientDto') deletePatientDto: { patient_id: patient['patient_id'], updated_by: client['client_id'] }
    ): Promise<patient> {

        const { patient_id, updated_by: client_id } = deletePatientDto
        
        return this.patientService.delete(currentClient, {
            whereUniqueInput: { patient_id },
            client_updated_by: { client_id }
        })
    }

    @MessagePattern('coordinator.totalPatients.patients')
    totalPatients(
        @Payload('company_id') company_id: CreatePatientDto['company_fk'],
    ): Promise<number> {
        return this.patientService.countPatientsByCompany({ company_id })
    }
}
