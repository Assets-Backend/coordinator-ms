import { registerEnumType } from "@nestjs/graphql";

export enum gender_options {
    m = 'm',
    f = 'f',
    M = 'M',
    F = 'F',
}

registerEnumType(gender_options, {
    name: 'gender_options', 
    description: 'Enumeración que representa el genero del usuario.'
})