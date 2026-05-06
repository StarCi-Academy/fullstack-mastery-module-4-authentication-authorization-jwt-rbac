/**
 * Guard bao ve route — roles.guard.
 * (EN: Route guard — roles.guard.)
 */
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from "@nestjs/common"
import {
    Reflector,
} from "@nestjs/core"
import {
    Role,
} from "../role.enum"
import {
    ROLES_KEY,
} from "../decorators/roles.decorator"

/**
 * Lá»›p AuthZ sau JwtAuthGuard â€” so khá»›p role trong JWT vá»›i `@Roles(...)`.
 * (EN: Authorization guard comparing JWT role vs endpoint metadata.)
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    /**
     * @param context â€” Nest execution context Ä‘á»ƒ Ä‘á»c handler/class metadata + HTTP request (EN: Nest execution context).
     * @returns true khi khÃ´ng cÃ³ `@Roles` hoáº·c role khá»›p (EN: allows when metadata absent or role matches).
     * @throws ForbiddenException â€” token há»£p lá»‡ nhÆ°ng khÃ´ng Ä‘á»§ quyá»n (EN: 403 when authenticated but unauthorized).
     */
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ])
        // KhÃ´ng gáº¯n @Roles â‡’ khÃ´ng Ã©p buá»™c AuthZ (public authenticated route pattern) / EN: open to any authenticated user
        if (!requiredRoles?.length) {
            return true
        }

        const req = context.switchToHttp().getRequest<{ user?: { userId: number; role: Role } }>()
        const role = req.user?.role
        // JWT cÃ³ thá»ƒ há»£p lá»‡ nhÆ°ng claim role khÃ´ng thuá»™c requiredRoles â‡’ 403 rÃµ rÃ ng hÆ¡n 401 (EN: distinguish AuthZ vs AuthN)
        if (!role || !requiredRoles.includes(role)) {
            throw new ForbiddenException("Forbidden resource")
        }
        return true
    }
}
