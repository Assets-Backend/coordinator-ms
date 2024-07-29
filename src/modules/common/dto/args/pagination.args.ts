import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";
import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class PaginationArgs {

    @Field(() => Int, { nullable: true})
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    page?: number = 1;
    
    @Field(() => Int, { nullable: true})
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number = 10;
}