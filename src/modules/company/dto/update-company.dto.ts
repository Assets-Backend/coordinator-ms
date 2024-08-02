import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsInt, IsPositive, Max } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  
    @IsInt()
    @IsPositive()
    @Max(2147483647)
    company_id: number; 

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    updated_by: number;
}
