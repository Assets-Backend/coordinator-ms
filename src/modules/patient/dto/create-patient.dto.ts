import { gender_options } from "@prisma/client";
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength, MinLength } from "class-validator";

export class CreatePatientDto {

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    updated_by: number;

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    company_fk: number;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    last_name: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    healthcare_provider?: string;

    @IsString()
    gender: gender_options;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Max(150)
    age?: number;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    phone?: string
    
    @IsOptional()
    @IsString()
    note?: string;
}
