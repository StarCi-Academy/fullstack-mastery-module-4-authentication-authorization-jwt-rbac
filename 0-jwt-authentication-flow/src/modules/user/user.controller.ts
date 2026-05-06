/**
 * Controller REST cho feature User.
 * (EN: REST controller for User feature.)
 */
import {
    Controller,
    Get,
    Request,
    UseGuards,
} from "@nestjs/common"
import {
    JwtAuthGuard,
} from "../auth/jwt-auth.guard"

/**
 * Routes vÃ­ dá»¥ cho resource sau khi Ä‘Ã£ authenticated.
 * (EN: Sample protected user routes requiring JWT.)
 */
@Controller("users")
export class UserController {
    /**
     * `GET /users/profile` â€” chá»‰ vÃ o Ä‘Æ°á»£c khi Bearer JWT há»£p lá»‡.
     * (EN: Protected profile route demonstrating JwtAuthGuard.)
     *
     * @param req â€” Express request cÃ³ `user` do JwtStrategy gÃ¡n (EN: request with user from JWT).
     */
    @UseGuards(JwtAuthGuard)
    @Get("profile")
    getProfile(@Request() req: { user: { userId: number } }) {
        return {
            message: "Bạn đã truy cập vào khu vực bảo mật!",
            user: {
                userId: req.user.userId,
            },
        }
    }
}
