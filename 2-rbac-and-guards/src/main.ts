import "dotenv/config"
import {
    NestFactory,
} from "@nestjs/core"
import {
    ValidationPipe,
} from "@nestjs/common"
import {
    AppModule,
} from "./app.module"

/**
 * Bootstrap Nest cho demo RBAC sau JWT (guard chain).
 * (EN: Bootstrap Nest app for RBAC lesson.)
 *
 * @returns Promise<void>
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }))
    await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
