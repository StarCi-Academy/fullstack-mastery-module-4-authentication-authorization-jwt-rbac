/**
 * Passport strategy — google.strategy.
 * (EN: Passport strategy — google.strategy.)
 */
import {
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
import {
    ConfigService,
} from "@nestjs/config"
import {
    PassportStrategy,
} from "@nestjs/passport"
import {
    Strategy,
    Profile,
} from "passport-google-oauth20"
import {
    AuthService,
} from "./auth.service"

/**
 * passport-google-oauth20 strategy â€” redirect flow handled by Passport middleware before hitting controller body.
 * (EN: Google OAuth2 strategy delegating persistence to AuthService.)
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,
    "google") {
    constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    ) {
        super({
            clientID: config.get<string>("GOOGLE_CLIENT_ID") ?? "",
            clientSecret: config.get<string>("GOOGLE_CLIENT_SECRET") ?? "",
            callbackURL: config.getOrThrow<string>("GOOGLE_CALLBACK_URL"),
            scope: [
                "email",
                "profile",
            ],
        })
    }

    /**
     * Passport gá»i sau khi Google tráº£ authorization â€” map Profile â†’ persisted User entity shape.
     * (EN: Validates profile contains email then upserts local user.)
     *
     * @param _accessToken â€” KhÃ´ng dÃ¹ng trong demo nhÆ°ng giá»¯ arity Passport (EN: unused OAuth access token).
     * @param _refreshToken â€” KhÃ´ng lÆ°u offline refresh trong demo ngáº¯n (EN: unused refresh token).
     * @param profile â€” passport-google-oauth20 profile payload (EN: Google profile object).
     * @returns User entity gáº¯n vÃ o `req.user` cho callback controller (EN: hydrated User for controller).
     */
    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
    ) {
        const email = profile.emails?.[0]?.value
        if (!email) {
            throw new UnauthorizedException("Google account has no email")
        }

        const user = await this.authService.findOrCreateFromGoogle({
            googleId: profile.id,
            email,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            picture: profile.photos?.[0]?.value,
        })

        return user
    }
}
