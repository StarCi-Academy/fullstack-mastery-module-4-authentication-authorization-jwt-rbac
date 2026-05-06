/**
 * Controller REST cho feature Auth.
 * (EN: REST controller for Auth feature.)
 */
import {
    Controller,
    Get,
    Req,
    UseGuards,
} from "@nestjs/common"
import {
    AuthGuard,
} from "@nestjs/passport"
import {
    AuthService,
} from "./auth.service"
import {
    User,
} from "../user/user.entity"

/**
 * Hai endpoint OAuth dance â€” khÃ´ng chá»©a body JSON; Passport Ä‘iá»u hÆ°á»›ng trÃ¬nh duyá»‡t (EN: OAuth redirect endpoints.)
 */
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Báº¯t Ä‘áº§u OAuth redirect sang Google consent screen (session:false pattern).
     * (EN: Starts Google OAuth authorization redirect.)
     */
    @Get("google")
    @UseGuards(AuthGuard("google"))
    googleRedirect() {
        /* Passport xá»­ lÃ½ redirect â€” handler khÃ´ng cáº§n response body (EN: Passport owns redirect.) */
        return
    }

    /**
     * Callback URL Ä‘Äƒng kÃ½ trÃªn Google Cloud â€” sau validate strategy tráº£ JWT JSON cho client/demo tooling.
     * (EN: OAuth callback issuing JSON token response.)
     *
     * @param req â€” Express req cÃ³ `user` lÃ  entity User sau validate() (EN: request carrying hydrated User).
     */
    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    async googleCallback(@Req() req: { user: User }) {
        return this.authService.completeGoogleLogin(req.user)
    }
}
