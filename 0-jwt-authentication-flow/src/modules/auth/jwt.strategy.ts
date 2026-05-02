import {
    Injectable,
} from "@nestjs/common"
import {
    PassportStrategy,
} from "@nestjs/passport"
import {
    ExtractJwt,
    Strategy,
} from "passport-jwt"

/** Payload JWT sau khi verify — chỉ chứa subject user id trong demo này. (EN: Verified JWT payload shape.) */
export type JwtPayload = { sub: number };

/**
 * passport-jwt strategy: đọc Bearer token, verify signature & expiry.
 * (EN: passport-jwt strategy extracting Bearer tokens.)
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET ?? "change-me",
        })
    }

    /**
     * Chuẩn hoá `req.user` cho các guard/controller phía sau.
     * (EN: Normalize request user attached after successful JWT verification.)
     *
     * @param payload — Claims đã decode (EN: decoded JWT claims).
     * @returns `{ userId }` để guard đính vào request (EN: minimal user shape on request).
     */
    validate(payload: JwtPayload) {
        return {
            userId: payload.sub,
        }
    }
}
