import { IsInt, IsOptional, IsPositive, IsString, Max, MaxLength, MinLength } from "class-validator";

export class CreateCompanyDto {

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    updated_by: number;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(20)
    cuit?: string
    
    @IsOptional()
    @IsString()
    note?: string;

}
