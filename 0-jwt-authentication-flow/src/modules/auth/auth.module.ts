import {
    Module,
} from "@nestjs/common"
import {
    JwtModule,
} from "@nestjs/jwt"
import {
    PassportModule,
} from "@nestjs/passport"
import {
    TypeOrmModule,
} from "@nestjs/typeorm"
import {
    User,
} from "../user/user.entity"
import {
    AuthController,
} from "./auth.controller"
import {
    AuthService,
} from "./auth.service"
import {
    JwtStrategy,
} from "./jwt.strategy"

/**
 * Gắn Passport JWT strategy + JwtModule để AuthService ký token.
 * (EN: Wires Passport JWT strategy and JwtModule for signing.)
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule.register({
            defaultStrategy: "jwt",
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? "change-me",
            signOptions: {
                expiresIn: "7d",
            },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule {}
