import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common"
import {
    AuthService,
} from "./auth.service"
import {
    JwtAuthGuard,
} from "./jwt-auth.guard"
import {
    RefreshDto,
} from "./dto/refresh.dto"
import {
    SignInDto,
} from "./dto/signin.dto"
import {
    SignUpDto,
} from "./dto/signup.dto"

/** REST `/auth/*` cho signup/signin/refresh/logout demo. (EN: Auth HTTP controller.) */
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signup")
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() body: SignUpDto) {
        return this.authService.signUp(body)
    }

    @Post("signin")
    @HttpCode(HttpStatus.OK)
    signIn(@Body() body: SignInDto) {
        return this.authService.signIn(body)
    }

    /** Body chỉ chứa refresh_token — không dùng Bearer refresh trong demo này. (EN: Refresh uses JSON body.) */
    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    refresh(@Body() body: RefreshDto) {
        return this.authService.refreshTokens(body)
    }

    /**
     * Cần access JWT để biết userId revoke refresh hash (AuthZ tối thiểu).
     * (EN: Requires bearer access token so server knows whose refresh hash to clear.)
     */
    @Post("logout")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    logout(@Req() req: { user: { userId: number } }) {
        return this.authService.logout(req.user.userId)
    }
}
