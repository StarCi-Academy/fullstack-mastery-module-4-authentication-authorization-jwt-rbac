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
 * Bootstrap demo refresh-token rotation / revocation.
 * (EN: Bootstrap Nest app for refresh-token lesson.)
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
