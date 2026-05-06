/**
 * Service xu ly logic nghiep vu cua Auth.
 * (EN: Business logic service for Auth.)
 */
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
    SignInDto,
} from "./dto/signin.dto"
import {
    SignUpDto,
} from "./dto/signup.dto"

/**
 * ÄÄƒng kÃ½ / Ä‘Äƒng nháº­p vÃ  phÃ¡t JWT access token (demo stateless auth).
 * (EN: Sign-up / sign-in and issue JWT access tokens for stateless auth.)
 */
@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
    ) {}

    /**
     * Táº¡o user má»›i sau khi hash máº­t kháº©u; trÃ¡nh trÃ¹ng email.
     * (EN: Persist user with bcrypt password hash; rejects duplicate emails.)
     *
     * @param dto - Email + plain password tá»« client (EN: credentials from client body).
     * @returns `{ message }` pháº£n há»“i tá»‘i giáº£n sau khi lÆ°u DB (EN: minimal ack payload).
     * @throws ConflictException â€” email Ä‘Ã£ tá»“n táº¡i (EN: when email collides).
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
        // Salt rounds cá»‘ Ä‘á»‹nh cho demo; production cÃ³ thá»ƒ tune theo policy (EN: fixed cost factor for bcrypt)
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
     * XÃ¡c thá»±c email/password vÃ  kÃ½ JWT chá»©a `sub` (user id).
     * (EN: Validate credentials then sign JWT carrying subject user id.)
     *
     * @param dto - Email + password plaintext (EN: sign-in payload).
     * @returns `{ access_token }` JWT cho header Bearer (EN: bearer token string).
     * @throws UnauthorizedException â€” sai user hoáº·c password (EN: invalid credential tuple).
     */
    async signIn(dto: SignInDto) {
        const user = await this.usersRepo.findOne({
            where: {
                email: dto.email,
            },
        })
        // KhÃ´ng tiáº¿t lá»™ user cÃ³ tá»“n táº¡i hay khÃ´ng trong message â€” chá»‰ generic error (EN: uniform error surface)
        if (!user || !(await bcrypt.compare(dto.password,
            user.password))) {
            throw new UnauthorizedException("Invalid credentials")
        }
        return {
            access_token: await this.jwtService.signAsync({
                sub: user.id,
            }),
        }
    }
}
