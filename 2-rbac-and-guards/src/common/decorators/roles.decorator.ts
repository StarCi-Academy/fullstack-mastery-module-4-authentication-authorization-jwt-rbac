/**
 * Custom decorator — roles.decorator.
 * (EN: Custom decorator — roles.decorator.)
 */
import {
    SetMetadata,
} from "@nestjs/common"
import {
    Role,
} from "../role.enum"

/** Metadata key Ä‘á»ƒ RolesGuard Ä‘á»c qua Reflector (EN: metadata key for RBAC guard.) */
export const ROLES_KEY = "roles"

/**
 * Gáº¯n danh sÃ¡ch Role Ä‘Æ°á»£c phÃ©p vÃ o handler/controller â€” declarative AuthZ.
 * (EN: Attach allowed roles metadata for declarative authorization.)
 *
 * @param roles â€” Má»™t hoáº·c nhiá»u Role enum (EN: allowed roles spread args).
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY,
    roles)
