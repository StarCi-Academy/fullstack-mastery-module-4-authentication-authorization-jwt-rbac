import {
    Injectable,
} from "@nestjs/common"
import {
    JwtService,
} from "@nestjs/jwt"
import {
    InjectRepository,
} from "@nestjs/typeorm"
import {
    Repository,
} from "typeorm"
import {
    User,
} from "../user/user.entity"
import type {
    GoogleProfilePayload,
} from "./google-profile"

/**
 * Ánh xạ Google identity → row DB và phát JWT nội bộ sau OAuth callback.
 * (EN: Links Google profiles to DB rows and signs internal JWTs.)
 */
@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
    ) {}

    /**
     * Silent registration / linking: nếu email mới → INSERT; nếu đã có → enrich googleId/profile fields.
     * (EN: Upserts local user linked to Google identity without separate signup form.)
     *
     * @param payload — Fields extracted from Google OAuth profile (EN: normalized Google payload).
     * @returns Persisted User entity ready for JWT signing (EN: hydrated user row).
     */
    async findOrCreateFromGoogle(payload: GoogleProfilePayload): Promise<User> {
        let user =
      (await this.usersRepo.findOne({
          where: {
              googleId: payload.googleId,
          },
      })) ??
      (await this.usersRepo.findOne({
          where: {
              email: payload.email,
          },
      }))

        if (!user) {
            user = this.usersRepo.create({
                email: payload.email,
                googleId: payload.googleId,
                firstName: payload.firstName ?? null,
                picture: payload.picture ?? null,
                password: null,
            })
            await this.usersRepo.save(user)
            return user
        }

        user.googleId = payload.googleId
        user.firstName = payload.firstName ?? user.firstName
        user.picture = payload.picture ?? user.picture
        await this.usersRepo.save(user)
        return user
    }

    /**
     * Phát JWT access token đơn giản chỉ chứa `sub` sau OAuth — client đổi sang Bearer như demo JWT flow.
     * (EN: Issues JWT carrying internal user id post OAuth.)
     *
     * @param user — Row đã có primary key sau OAuth handshake (EN: persisted user entity).
     */
    async issueAccessToken(user: User) {
        const access_token = await this.jwtService.signAsync({
            sub: user.id,
        })
        return {
            access_token,
        }
    }
}
