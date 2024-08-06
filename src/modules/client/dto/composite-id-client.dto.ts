import { IsInt, IsPositive, Max } from 'class-validator';

export class CompositeIdDto {

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    company_fk: number;

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    patient_fk: number;

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    treatment_fk: number;
}