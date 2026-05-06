/**
 * DTO validate payload dang nhap.
 * (EN: DTO validates sign-in payload.)
 */
import {
    IsEmail,
    IsString,
} from "class-validator"

/** Body Ä‘Äƒng nháº­p â€” password plaintext chá»‰ tá»“n táº¡i trong transit Ä‘á»ƒ bcrypt.compare. (EN: Sign-in DTO.) */
export class SignInDto {
    @IsEmail()
        email: string

    @IsString()
        password: string
}
