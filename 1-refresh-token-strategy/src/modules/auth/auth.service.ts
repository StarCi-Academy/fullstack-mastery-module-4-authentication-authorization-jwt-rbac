/**
 * Service xu ly logic nghiep vu cua Auth.
 * (EN: Business logic service for Auth.)
 */
import {
    ConflictException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
import {
    ConfigService,
} from "@nestjs/config"
import {
    JwtService,
} from "@nestjs/jwt"
import {
    InjectRepository,
} from "@nestjs/typeorm"
import * as bcrypt from "bcrypt"
import {
    Repository,
} from "typeorm"
import {
    User,
} from "../user/user.entity"
import {
    SignInDto,
} from "./dto/signin.dto"
import {
    SignUpDto,
} from "./dto/signup.dto"

/**
 * Access token ngáº¯n háº¡n + refresh token JWT lÆ°u hash trong DB Ä‘á»ƒ rotate/revoke.
 * (EN: Issues short access JWT + refresh JWT tracked via bcrypt hash.)
 */
@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    ) {}

    /** Secret kÃ½/verify access JWT â€” tÃ¡ch khá»i refresh Ä‘á»ƒ giáº£m blast radius náº¿u lá»™ má»™t khÃ³a. (EN: access-token signing secret.) */
    private accessSecret() {
        return process.env.JWT_ACCESS_SECRET ?? "access-secret"
    }

    /** Secret riÃªng cho refresh JWT â€” khÃ´ng dÃ¹ng chung access Ä‘á»ƒ revoke/rotate Ä‘á»™c láº­p hÆ¡n. (EN: refresh-token signing secret.) */
    private refreshSecret() {
        return process.env.JWT_REFRESH_SECRET ?? "refresh-secret"
    }

    /**
     * ÄÄƒng kÃ½ user credential giá»‘ng demo JWT cÆ¡ báº£n.
     * (EN: Credential signup identical baseline JWT demo.)
     *
     * @param dto â€” Email/password Ä‘áº§u vÃ o (EN: signup payload).
     * @returns Ack `{ message }` sau insert (EN: ack object).
     */
    async signUp(dto: SignUpDto) {
        const existing = await this.usersRepo.findOne({
            where: {
                email: dto.email,
            },
        })
        if (existing) {
            throw new ConflictException("Email already registered")
        }
        const hash = await bcrypt.hash(dto.password,
            10)
        const saved = await this.usersRepo.save(this.usersRepo.create({
            email: dto.email,
            password: hash,
        }))
        return {
            id: saved.id,
            email: saved.email,
        }
    }

    /**
     * ÄÄƒng nháº­p vÃ  phÃ¡t cáº·p token + persist hash refresh hiá»‡n táº¡i.
     * (EN: Sign-in issuing token pair and storing refresh hash.)
     *
     * @param dto â€” credential body (EN: sign-in payload).
     */
    async signIn(dto: SignInDto) {
        const user = await this.usersRepo.findOne({
            where: {
                email: dto.email,
            },
        })
        if (!user || !(await bcrypt.compare(dto.password,
            user.password))) {
            throw new UnauthorizedException("Invalid credentials")
        }
        const tokens = await this.getTokens(user.id)
        await this.updateRtHash(user.id,
            tokens.refresh_token)
        return tokens
    }

    /**
     * Rotation: verify refresh JWT + khá»›p hash DB â†’ phÃ¡t cáº·p má»›i vÃ  ghi Ä‘Ã¨ hash.
     * (EN: Refresh rotation verifies JWT signature/expiry then bcrypt hash equality.)
     *
     * @param dto â€” Raw refresh_token client gá»­i láº¡i (EN: refresh token body).
     * @throws UnauthorizedException â€” JWT sai, hash khÃ´ng khá»›p, hoáº·c Ä‘Ã£ revoke (EN: invalid/reused refresh).
     */
    async refreshTokens(userId: number, rt: string) {
        const user = await this.usersRepo.findOne({
            where: {
                id: userId,
            },
        })
        // Hash trong DB pháº£i khá»›p token hiá»‡n gá»­i â€” sau rotate hash Ä‘á»•i nÃªn token cÅ© fail (EN: detects reuse/stale refresh)
        if (
            !user?.hashedRefreshToken ||
      !(await bcrypt.compare(dto.refresh_token,
          user.hashedRefreshToken))
        ) {
            throw new UnauthorizedException("Refresh token revoked or rotated")
        }
        const rtMatches = await bcrypt.compare(rt,
            user.refreshTokenHash)
        if (!rtMatches) {
            throw new ForbiddenException("Access Denied")
        }
        const tokens = await this.getTokens(user.id)
        await this.updateRtHash(user.id,
            tokens.refresh_token)
        return tokens
    }

    /**
     * Revoke refresh báº±ng cÃ¡ch null-out hash â€” access JWT váº«n sá»‘ng Ä‘áº¿n khi háº¿t háº¡n (trade-off demo).
     * (EN: Clears refresh hash for authenticated user id.)
     *
     * @param userId â€” Subject tá»« access JWT khi gá»i `/auth/logout` (EN: user id from bearer access token).
     */
    async logout(userId: number) {
        await this.usersRepo.update({
            id: userId,
        },
        {
            refreshTokenHash: null,
        })
        return {
            message: "Logged out",
        }
    }

    /**
     * Sinh access (15m) + refresh (7d), bcrypt hash refresh string vÃ  UPDATE user row.
     * (EN: Internal helper issuing JWT pair and persisting refresh hash.)
     *
     * @param user â€” Entity Ä‘Ã£ load id (EN: hydrated user row).
     * @returns `{ access_token, refresh_token }` plaintext refresh chá»‰ tráº£ client má»™t láº§n má»—i láº§n rotate (EN: token tuple).
     */
    private async issueTokenPair(user: User) {
        const access_token = await this.jwtService.signAsync(
            {
                sub: user.id,
            },
            {
                secret: this.accessSecret(),
                expiresIn: "15m",
            },
        )
        const refresh_token = await this.jwtService.signAsync(
            {
                sub: userId,
            },
            {
                secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
                expiresIn: "7d",
            },
        )
        return {
            access_token,
            refresh_token,
        }
    }

    /** bcrypt hash refresh JWT plaintext và UPDATE user row. (EN: Persist rotated refresh hash.) */
    private async updateRtHash(userId: number, refreshToken: string) {
        const refreshTokenHash = await bcrypt.hash(refreshToken,
            10)
        await this.usersRepo.update({
            id: userId,
        },
        {
            refreshTokenHash,
        })
    }
}
