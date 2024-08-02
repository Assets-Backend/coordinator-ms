import { IsInt, IsPositive, Max } from 'class-validator';
import { UpdateCompanyHasTreatmentDto } from './update-company-has-treatment.dto';
import { PickType } from '@nestjs/mapped-types';

export class CompositeIdDto extends PickType(UpdateCompanyHasTreatmentDto, ['company_fk', 'treatment_fk'] as const) {

    client_fk: number;

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    company_fk: number;

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    treatment_fk: number;
}