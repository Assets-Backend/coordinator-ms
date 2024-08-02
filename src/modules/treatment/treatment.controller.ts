import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TreatmentService } from './treatment.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { CurrentClient } from 'src/common/decorators/current-client.decorator';
import { ClientIds } from 'src/common/interface/client-ids.interface';
import { client, treatment } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';

@Controller()
export class TreatmentController {

    constructor(private readonly treatmentService: TreatmentService) {}

    @MessagePattern('coordinator.create.treatment')
    create(
        @CurrentClient() currentClient: ClientIds,
        @Payload('createTreatmentDto') createTreatmentDto: CreateTreatmentDto,
    ): Promise<treatment> {

        const { updated_by: client_id, ...data }: any = createTreatmentDto

        return this.treatmentService.create(currentClient, {
            client_updated_by: { client_id },
            data
        })
    }

    @MessagePattern('coordinator.find.treatment')
    findOne(
        @CurrentClient() currentClient: ClientIds,
        @Payload('treatment_id') treatment_id: number
    ): Promise<treatment> {

        return this.treatmentService.findOneByUnique(currentClient, {
            treatmentWhereUniqueInput: {
                treatment_id
            }
        });
    }

    @MessagePattern('coordinator.find.treatments')
    findAll(
        @CurrentClient() currentClient: ClientIds,
        @Payload('paginationDto') paginationDto: PaginationDto
    ): Promise<treatment[]> {

        const { limit: take, offset: skip } = paginationDto

        return this.treatmentService.findAll(currentClient, {
            whereInput: { deleted_at: null },
            skip,
            take
        })
    }

    @MessagePattern('coordinator.update.treatment')
    update(
        @CurrentClient() currentClient: ClientIds,
        @Payload('updateTreatmentDto') updateTreatmentDto: UpdateTreatmentDto
    ): Promise<treatment> {

        const { treatment_id, updated_by: client_id, ...data } = updateTreatmentDto

        return this.treatmentService.update(currentClient, {
            whereUniqueInput: { treatment_id },
            client_updated_by: { client_id  },
            data,
        })
    }

    @MessagePattern('coordinator.delete.treatment')
    delete(
        @CurrentClient() currentClient: ClientIds,
        @Payload('deleteTreatmentDto') deleteTreatmentDto: { treatment_id: treatment['treatment_id'], updated_by: client['client_id'] }
    ): Promise<treatment> {

        const { treatment_id, updated_by: client_id } = deleteTreatmentDto
        
        return this.treatmentService.delete(currentClient, {
            whereUniqueInput: { treatment_id },
            client_updated_by: { client_id }
        })
    }
}
