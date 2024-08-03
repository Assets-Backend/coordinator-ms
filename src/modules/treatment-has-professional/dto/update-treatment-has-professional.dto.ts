import { PartialType } from '@nestjs/mapped-types';
import { CreateTreatmentHasProfessionalDto } from './create-treatment-has-professional.dto';
import { IsInt, IsPositive, Max } from 'class-validator';

export class UpdateTreatmentHasProfessionalDto extends PartialType(CreateTreatmentHasProfessionalDto) {

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
    professional_fk: number; 

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    updated_by: number;
}
