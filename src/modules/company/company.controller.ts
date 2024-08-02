import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { CurrentClient } from 'src/common/decorators/current-client.decorator';
import { ClientIds } from 'src/common/interface/client-ids.interface';
import { client, company } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';

@Controller()
export class CompanyController {

    constructor(private readonly companyService: CompanyService) {}

    @MessagePattern('coordinator.create.company')
    create(
        @CurrentClient() currentClient: ClientIds,
        @Payload('createCompanyDto') createCompanyDto: CreateCompanyDto,
    ): Promise<company> {

        const { updated_by: client_id, ...data }: any = createCompanyDto

        return this.companyService.create(currentClient, {
            client_updated_by: { client_id },
            data
        })
    }

    @MessagePattern('coordinator.find.company')
    findOne(
        @CurrentClient() currentClient: ClientIds,
        @Payload('company_id') company_id: number
    ): Promise<company> {

        return this.companyService.findOneByUnique(currentClient, {
            companyWhereUniqueInput: {
                company_id
            }
        });
    }

    @MessagePattern('coordinator.find.companies')
    findAll(
        @CurrentClient() currentClient: ClientIds,
        @Payload('paginationDto') paginationDto: PaginationDto
    ): Promise<company[]> {

        const { limit: take, offset: skip } = paginationDto

        return this.companyService.findAll(currentClient, {
            whereInput: { deleted_at: null },
            skip,
            take
        })
    }

    @MessagePattern('coordinator.update.company')
    update(
        @CurrentClient() currentClient: ClientIds,
        @Payload('updateCompanyDto') updateCompanyDto: UpdateCompanyDto
    ): Promise<company> {

        const { company_id, updated_by: client_id, ...data } = updateCompanyDto

        return this.companyService.update(currentClient, {
            whereUniqueInput: { company_id },
            client_updated_by: { client_id  },
            data,
        })
    }

    @MessagePattern('coordinator.delete.company')
    delete(
        @CurrentClient() currentClient: ClientIds,
        @Payload('deleteCompanyDto') deleteCompanyDto: { company_id: company['company_id'], updated_by: client['client_id'] }
    ): Promise<company> {

        const { company_id, updated_by: client_id } = deleteCompanyDto
        
        return this.companyService.delete(currentClient, {
            whereUniqueInput: { company_id },
            client_updated_by: { client_id }
        })
    }
}
