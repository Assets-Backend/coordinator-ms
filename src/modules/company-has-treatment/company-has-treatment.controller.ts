import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompanyHasTreatmentService } from './company-has-treatment.service';
import { CreateCompanyHasTreatmentDto, UpdateCompanyHasTreatmentDto, CompositeIdDto } from './dto';
import { CurrentClient } from 'src/common/decorators/current-client.decorator';
import { ClientIds } from 'src/common/interface/client-ids.interface';
import { company_has_treatment } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';

@Controller()
export class CompanyHasTreatmentController {
  
    constructor(private readonly companyHasTreatmentService: CompanyHasTreatmentService) {}

    @MessagePattern('coordinator.create.companyHasTreatment')
    create(
        @CurrentClient() currentClient: ClientIds,
        @Payload('createCompanyHasTreatmentDto') createCompanyHasTreatmentDto: CreateCompanyHasTreatmentDto,
    ): Promise<company_has_treatment> {

        const { updated_by: client_id, company_fk, treatment_fk, ...data }: any = createCompanyHasTreatmentDto

        return this.companyHasTreatmentService.create(currentClient, {
            client_updated_by: { client_id },
            company_company_fk: { company_id: company_fk },
            treatment_treatment_fk: { treatment_id: treatment_fk },
            data
        })
    }

    @MessagePattern('coordinator.find.companyHasTreatment')
    findOne(
        @CurrentClient() currentClient: ClientIds,
        @Payload('compositeIdDto') compositeIdDto: CompositeIdDto
    ): Promise<Number> {

        return this.companyHasTreatmentService.findOneByUnique(currentClient, {
            companyHasTreatmentWhereUniqueInput: { client_fk_company_fk_treatment_fk: compositeIdDto },
            select: {value: true}
        }) as unknown as Promise<Number>;
    }

    @MessagePattern('coordinator.find.companyHasTreatments')
    findAll(
        @CurrentClient() currentClient: ClientIds,
        @Payload('paginationDto') paginationDto: PaginationDto
    ): Promise<company_has_treatment[]> {

        const { limit: take, offset: skip } = paginationDto

        return this.companyHasTreatmentService.findAll(currentClient, {
            companyHasTreatmentWhereInput: { },
            skip,
            take
        })
    }

    @MessagePattern('coordinator.update.companyHasTreatment')
    update(
        @CurrentClient() currentClient: ClientIds,
        @Payload('updateCompanyHasTreatmentDto') updateCompanyHasTreatmentDto: UpdateCompanyHasTreatmentDto
    ): Promise<company_has_treatment> {

        const { company_fk, treatment_fk, updated_by: client_id, ...data } = updateCompanyHasTreatmentDto

        return this.companyHasTreatmentService.update(currentClient, {
            companyHasTreatmentWhereUniqueInput: { client_fk_company_fk_treatment_fk: { company_fk, treatment_fk, client_fk: null } },
            client_updated_by: { client_id  },
            data,
        })
    }

    @MessagePattern('coordinator.delete.companyHasTreatment')
    delete(
        @CurrentClient() currentClient: ClientIds,
        @Payload('compositeIdDto') compositeIdDto: CompositeIdDto
    ): Promise<company_has_treatment> {

        const { company_fk, treatment_fk } = compositeIdDto

        return this.companyHasTreatmentService.delete(currentClient, {
            companyHasTreatmentWhereUniqueInput: { client_fk_company_fk_treatment_fk: {
                client_fk: null, company_fk, treatment_fk 
            } },
        })
    }
}
