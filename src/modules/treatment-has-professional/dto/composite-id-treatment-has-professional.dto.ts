import { IsInt, IsPositive, Max } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import { UpdateTreatmentHasProfessionalDto } from './update-treatment-has-professional.dto';

export class CompositeIdDto extends PickType(UpdateTreatmentHasProfessionalDto, ['company_fk', 'treatment_fk', 'professional_fk'] as const) {

    client_fk: number;

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
}