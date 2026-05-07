/**
 * UserModule — đăng ký các thành phần của feature User.
 * (EN: UserModule — registers components for User feature.)
 */
import {
    Module,
} from "@nestjs/common"
import {
    TypeOrmModule,
} from "@nestjs/typeorm"
import {
    UserEntity,
} from "./user.entity"
import {
    UserController,
} from "./user.controller"

/**
 * Feature module user + TypeORM repository registration.
 * (EN: User feature module exporting TypeORM feature set.)
 */
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    exports: [TypeOrmModule],
})
export class UserModule {}
