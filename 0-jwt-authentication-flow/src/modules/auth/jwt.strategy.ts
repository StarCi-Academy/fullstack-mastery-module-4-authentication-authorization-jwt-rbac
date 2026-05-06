/**
 * Passport strategy — jwt.strategy.
 * (EN: Passport strategy — jwt.strategy.)
 */
import {
    Injectable,
} from "@nestjs/common"
import {
    ConfigService,
} from "@nestjs/config"
import {
    PassportStrategy,
} from "@nestjs/passport"
import {
    ExtractJwt,
    Strategy,
} from "passport-jwt"

/** Payload JWT sau khi verify â€” chá»‰ chá»©a subject user id trong demo nÃ y. (EN: Verified JWT payload shape.) */
export type JwtPayload = { sub: number };

/**
 * passport-jwt strategy: Ä‘á»c Bearer token, verify signature & expiry.
 * (EN: passport-jwt strategy extracting Bearer tokens.)
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>("JWT_SECRET"),
        })
    }

    /**
     * Chuáº©n hoÃ¡ `req.user` cho cÃ¡c guard/controller phÃ­a sau.
     * (EN: Normalize request user attached after successful JWT verification.)
     *
     * @param payload â€” Claims Ä‘Ã£ decode (EN: decoded JWT claims).
     * @returns `{ userId }` Ä‘á»ƒ guard Ä‘Ã­nh vÃ o request (EN: minimal user shape on request).
     */
    validate(payload: JwtPayload) {
        return {
            userId: payload.sub,
        }
    }
}
