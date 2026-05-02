import {
    Injectable,
} from "@nestjs/common"
import {
    AuthGuard,
} from "@nestjs/passport"

/** Guard JWT access — dùng cho `/auth/logout` trong demo này. (EN: Bearer access JWT guard.) */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
