/**
 * DTO validate payload lam moi token.
 * (EN: DTO validates token refresh payload.)
 */
import {
    IsString,
    MinLength,
} from "class-validator"

/** Client gá»­i refresh JWT string trong JSON â€” khÃ´ng Ä‘áº·t trong header Ä‘á»ƒ Ä‘Æ¡n giáº£n curl/postman. (EN: Refresh token transport DTO.) */
export class RefreshDto {
    @IsString()
    @MinLength(10)
        refresh_token: string
}
