import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TreatmentHasProfessionalService } from './treatment-has-professional.service';
import { CreateTreatmentHasProfessionalDto, UpdateTreatmentHasProfessionalDto, CompositeIdDto } from './dto';
import { treatment_has_professional } from '@prisma/client';
import { CurrentClient } from 'src/common/decorators/current-client.decorator';
import { ClientIds } from 'src/common/interface/client-ids.interface';
import { PaginationDto } from 'src/common/dto';

@Controller()
export class TreatmentHasProfessionalController {
  
    constructor(private readonly treatmentHasProfessionalService: TreatmentHasProfessionalService) {}

    @MessagePattern('coordinator.find.treatmentHasProfessional')
    findOne(
        @CurrentClient() currentClient: ClientIds,
        @Payload('compositeIdDto') compositeIdDto: CompositeIdDto
    ): Promise<Number> {

        return this.treatmentHasProfessionalService.findOneByUnique(currentClient, {
            treatmentHasProfessionalmentWhereUniqueInput: { 
                client_fk_professional_fk_company_fk_treatment_fk: compositeIdDto 
            },
            select: { value: true }
        }) as unknown as Promise<Number>;
    }

    @MessagePattern('coordinator.find.treatmentHasProfessionals')
    findAll(
        @CurrentClient() currentClient: ClientIds,
        @Payload('paginationDto') paginationDto: PaginationDto
    ): Promise<treatment_has_professional[]> {

        const { limit: take, offset: skip } = paginationDto

        return this.treatmentHasProfessionalService.findAll(currentClient, {
            treatmentHasProfessionalmentWhereInput: { },
            skip,
            take
        })
    }

    @MessagePattern('coordinator.update.treatmentHasProfessional')
    update(
        @CurrentClient() currentClient: ClientIds,
        @Payload('updateTreatmentHasProfessionalDto') updateTreatmentHasProfessionalDto: UpdateTreatmentHasProfessionalDto
    ): Promise<treatment_has_professional> {

        const { professional_fk, company_fk, treatment_fk, updated_by: client_id, ...data } = updateTreatmentHasProfessionalDto

        return this.treatmentHasProfessionalService.update(currentClient, {
            treatmentHasProfessionalmentWhereUniqueInput: { client_fk_professional_fk_company_fk_treatment_fk: { 
                    professional_fk, company_fk, treatment_fk, client_fk: null
                } 
            },
            client_updated_by: { client_id  },
            data,
        })
    }

    @MessagePattern('coordinator.delete.treatmentHasProfessional')
    delete(
        @CurrentClient() currentClient: ClientIds,
        @Payload('compositeIdDto') compositeIdDto: CompositeIdDto
    ): Promise<treatment_has_professional> {

        const { professional_fk, company_fk, treatment_fk } = compositeIdDto

        return this.treatmentHasProfessionalService.delete(currentClient, {
            treatmentHasProfessionalmentWhereUniqueInput: { client_fk_professional_fk_company_fk_treatment_fk: {
                client_fk: null, company_fk, treatment_fk, professional_fk
            } },
        })
    }
}
