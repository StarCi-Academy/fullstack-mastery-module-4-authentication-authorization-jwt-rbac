import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
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
    RefreshDto,
} from "./dto/refresh.dto"
import {
    SignInDto,
} from "./dto/signin.dto"
import {
    SignUpDto,
} from "./dto/signup.dto"

/**
 * Access token ngắn hạn + refresh token JWT lưu hash trong DB để rotate/revoke.
 * (EN: Issues short access JWT + refresh JWT tracked via bcrypt hash.)
 */
@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
    ) {}

    /** Secret ký/verify access JWT — tách khỏi refresh để giảm blast radius nếu lộ một khóa. (EN: access-token signing secret.) */
    private accessSecret() {
        return process.env.JWT_ACCESS_SECRET ?? "access-secret"
    }

    /** Secret riêng cho refresh JWT — không dùng chung access để revoke/rotate độc lập hơn. (EN: refresh-token signing secret.) */
    private refreshSecret() {
        return process.env.JWT_REFRESH_SECRET ?? "refresh-secret"
    }

    /**
     * Đăng ký user credential giống demo JWT cơ bản.
     * (EN: Credential signup identical baseline JWT demo.)
     *
     * @param dto — Email/password đầu vào (EN: signup payload).
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
        await this.usersRepo.save(this.usersRepo.create({
            email: dto.email,
            password: hash,
        }))
        return {
            message: "Created",
        }
    }

    /**
     * Đăng nhập và phát cặp token + persist hash refresh hiện tại.
     * (EN: Sign-in issuing token pair and storing refresh hash.)
     *
     * @param dto — credential body (EN: sign-in payload).
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
        return this.issueTokenPair(user)
    }

    /**
     * Rotation: verify refresh JWT + khớp hash DB → phát cặp mới và ghi đè hash.
     * (EN: Refresh rotation verifies JWT signature/expiry then bcrypt hash equality.)
     *
     * @param dto — Raw refresh_token client gửi lại (EN: refresh token body).
     * @throws UnauthorizedException — JWT sai, hash không khớp, hoặc đã revoke (EN: invalid/reused refresh).
     */
    async refreshTokens(dto: RefreshDto) {
        let payload: { sub: number }
        try {
            payload = await this.jwtService.verifyAsync<{ sub: number }>(dto.refresh_token,
                {
                    secret: this.refreshSecret(),
                })
        } catch {
            throw new UnauthorizedException("Invalid refresh token")
        }

        const user = await this.usersRepo.findOne({
            where: {
                id: payload.sub,
            },
        })
        // Hash trong DB phải khớp token hiện gửi — sau rotate hash đổi nên token cũ fail (EN: detects reuse/stale refresh)
        if (
            !user?.hashedRefreshToken ||
      !(await bcrypt.compare(dto.refresh_token,
          user.hashedRefreshToken))
        ) {
            throw new UnauthorizedException("Refresh token revoked or rotated")
        }

        return this.issueTokenPair(user)
    }

    /**
     * Revoke refresh bằng cách null-out hash — access JWT vẫn sống đến khi hết hạn (trade-off demo).
     * (EN: Clears refresh hash for authenticated user id.)
     *
     * @param userId — Subject từ access JWT khi gọi `/auth/logout` (EN: user id from bearer access token).
     */
    async logout(userId: number) {
        await this.usersRepo.update({
            id: userId,
        },
        {
            hashedRefreshToken: null,
        })
        return {
            message: "Logged out",
        }
    }

    /**
     * Sinh access (15m) + refresh (7d), bcrypt hash refresh string và UPDATE user row.
     * (EN: Internal helper issuing JWT pair and persisting refresh hash.)
     *
     * @param user — Entity đã load id (EN: hydrated user row).
     * @returns `{ access_token, refresh_token }` plaintext refresh chỉ trả client một lần mỗi lần rotate (EN: token tuple).
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
                sub: user.id,
            },
            {
                secret: this.refreshSecret(),
                expiresIn: "7d",
            },
        )

        const hashedRefreshToken = await bcrypt.hash(refresh_token,
            10)
        await this.usersRepo.update({
            id: user.id,
        },
        {
            hashedRefreshToken,
        })

        return {
            access_token,
            refresh_token,
        }
    }
}
