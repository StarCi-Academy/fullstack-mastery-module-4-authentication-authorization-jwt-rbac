/**
 * AdminModule — dang ky cac thanh phan cua feature Admin.
 * (EN: AdminModule — registers components for Admin feature.)
 */
import {
    Module,
} from "@nestjs/common"
import {
    AdminController,
} from "./admin.controller"
import {
    RolesGuard,
} from "../../common/guards/roles.guard"

/** Module Ä‘Äƒng kÃ½ RolesGuard nhÆ° provider Ä‘á»ƒ Nest inject Reflector Ä‘Ãºng scope demo. (EN: Admin feature module.) */
@Module({
    controllers: [AdminController],
    providers: [RolesGuard],
})
export class AdminModule {}
