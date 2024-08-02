import { IsInt, IsOptional, IsPositive, IsString, Max, MaxLength, MinLength } from "class-validator";

export class CreateTreatmentDto {

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    updated_by: number;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsString()
    @MinLength(2)
    @MaxLength(10)
    abbreviation: string;

    @IsOptional()
    @IsString()
    description?: string;
}
