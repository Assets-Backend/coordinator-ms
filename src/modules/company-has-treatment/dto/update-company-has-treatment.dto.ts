import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyHasTreatmentDto } from './create-company-has-treatment.dto';
import { IsInt, IsPositive, Max } from 'class-validator';

export class UpdateCompanyHasTreatmentDto extends PartialType(CreateCompanyHasTreatmentDto) {

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    company_fk: number; 

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    treatment_fk: number; 

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    updated_by: number;
}
