import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';
import { IsInt, IsPositive, Max } from 'class-validator';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    patient_id: number; 

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    updated_by: number;
}
