/**
 * Controller REST cho feature Admin.
 * (EN: REST controller for Admin feature.)
 */
import {
    Controller,
    Get,
    UseGuards,
} from "@nestjs/common"
import {
    Role,
    Roles,
    RolesGuard,
} from "../../common"
import {
    JwtAuthGuard,
} from "../auth"

/**
 * Namespace ví dụ chỉ ADMIN được vào sau guard chain Jwt → Roles.
 * (EN: Sample admin-only controller illustrating guard ordering.)
 */
@Controller("admin")
export class AdminController {
    /**
     * Guard ordering matters: JwtAuthGuard establishes identity; RolesGuard enforces privilege.
     * (EN: Sequential guards.)
     */
    @UseGuards(JwtAuthGuard,
        RolesGuard)
    @Roles(Role.ADMIN)
    @Get("dashboard")
    getDashboard() {
        return {
            message: "Chào mừng Admin vào khu vực mật!",
            stats: {
                users: 100,
                orders: 15,
            },
        }
    }
}
