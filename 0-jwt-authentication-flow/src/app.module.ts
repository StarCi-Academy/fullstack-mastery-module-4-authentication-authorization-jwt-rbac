import {
    Module,
} from "@nestjs/common"
import {
    TypeOrmModule,
} from "@nestjs/typeorm"
import {
    AuthModule,
} from "./modules/auth/auth.module"
import {
    UserModule,
} from "./modules/user/user.module"
import {
    User,
} from "./modules/user/user.entity"

/**
 * Root module: Postgres + Auth + User routes cho demo JWT.
 * (EN: Root module wiring Postgres with auth and user feature modules.)
 */
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DATABASE_HOST ?? "localhost",
            port: Number(process.env.DATABASE_PORT ?? 5432),
            username: process.env.DATABASE_USER ?? "starci_user",
            password: process.env.DATABASE_PASSWORD ?? "starci_password",
            database: process.env.DATABASE_NAME ?? "starci_db",
            entities: [User],
            // synchronize chỉ cho demo local — production nên migration (EN: auto-sync OK for lesson DB only)
            synchronize: true,
        }),
        AuthModule,
        UserModule,
    ],
})
export class AppModule {}
