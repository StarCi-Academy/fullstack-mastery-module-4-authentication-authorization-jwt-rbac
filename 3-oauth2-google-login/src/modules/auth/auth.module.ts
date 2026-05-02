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
    GoogleStrategy,
} from "./google.strategy"

/** Passport session disabled — chỉ redirect OAuth stateless đủ cho demo JWT sau callback. (EN: Stateless OAuth wiring.) */
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule.register({
            session: false,
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
        GoogleStrategy,
    ],
})
export class AuthModule {}
