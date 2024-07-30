import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateClientDto {

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    last_name: string;

    @IsString()
    @MinLength(5)
    @MaxLength(100)
    profile: string;
}
