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

/** Passport JWT default + JwtModule configured with access defaults (refresh signs override in service). (EN: Auth module wiring.) */
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule.register({
            defaultStrategy: "jwt",
        }),
        JwtModule.register({
            secret: process.env.JWT_ACCESS_SECRET ?? "access-secret",
            signOptions: {
                expiresIn: "15m",
            },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
    ],
})
export class AuthModule {}
