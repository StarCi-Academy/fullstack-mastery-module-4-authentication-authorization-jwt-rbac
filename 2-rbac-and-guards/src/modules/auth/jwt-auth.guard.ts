/**
 * Guard bao ve route — jwt-auth.guard.
 * (EN: Route guard — jwt-auth.guard.)
 */
import {
    Injectable,
} from "@nestjs/common"
import {
    AuthGuard,
} from "@nestjs/passport"

/** AuthN boundary â€” pháº£i cháº¡y **trÆ°á»›c** RolesGuard Ä‘á»ƒ cÃ³ `req.user.role`. (EN: JWT authentication guard.) */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
