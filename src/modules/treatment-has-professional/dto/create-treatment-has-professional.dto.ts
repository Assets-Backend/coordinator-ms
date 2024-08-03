import { IsInt, IsNumber, IsPositive, Max } from "class-validator";

export class CreateTreatmentHasProfessionalDto {

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    updated_by: number;

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

    @IsNumber()
    @IsPositive()
    value: number;
}
