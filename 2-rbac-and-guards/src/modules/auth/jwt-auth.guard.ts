import {
    Injectable,
} from "@nestjs/common"
import {
    AuthGuard,
} from "@nestjs/passport"

/** AuthN boundary — phải chạy **trước** RolesGuard để có `req.user.role`. (EN: JWT authentication guard.) */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
