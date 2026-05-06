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

/**
 * KÃ­ch hoáº¡t Passport strategy tÃªn `jwt` cho route Ä‘Æ°á»£c annotate `@UseGuards`.
 * (EN: Activates registered Passport JWT strategy before controller handlers.)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
