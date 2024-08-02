import { PartialType } from '@nestjs/mapped-types';
import { CreateTreatmentDto } from './create-treatment.dto';
import { IsInt, IsPositive, Max } from 'class-validator';

export class UpdateTreatmentDto extends PartialType(CreateTreatmentDto) {

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    treatment_id: number; 

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    updated_by: number;
}
