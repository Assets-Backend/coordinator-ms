import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsInt, IsPositive, Max } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {

    @IsInt()
    @IsPositive()
    @Max(2147483647)
    updated_by: number;
}
