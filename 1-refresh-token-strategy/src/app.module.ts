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
    User,
} from "./modules/user/user.entity"

/** Root module — Postgres + Auth cho access/refresh JWT. (EN: Root wiring DB + auth.) */
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
            synchronize: true,
        }),
        AuthModule,
    ],
})
export class AppModule {}
