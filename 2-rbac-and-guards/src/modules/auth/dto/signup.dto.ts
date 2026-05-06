/**
 * DTO validate payload dang ky.
 * (EN: DTO validates sign-up payload.)
 */
import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
} from "class-validator"
import {
    Role,
} from "../../../common/role.enum"

/** Signup cÃ³ optional role Ä‘á»ƒ demo táº¡o admin â€” khÃ´ng copy pattern nÃ y sang production verbatim. (EN: Sign-up DTO with optional role.) */
export class SignUpDto {
    @IsEmail()
        email: string

    @IsString()
    @MinLength(6)
        password: string

    @IsOptional()
    @IsEnum(Role)
        role?: Role
}
