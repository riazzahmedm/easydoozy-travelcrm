import { Controller, Post, Body, Get, UseGuards, Req, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "@nestjs/passport";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res
  ) {
    const { accessToken } = await this.authService.login(dto);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    return { success: true };
  }

  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @Get("me")
  me(@Req() req) {
    return req.user;
  }

  @Post("forgot-password")
  forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req) {
    return this.authService.forgotPassword(dto, req.tenantId);
  }

  @Post("reset-password")
  resetPassword(@Body() dto: ResetPasswordDto, @Req() req) {
    return this.authService.resetPassword(dto, req.tenantId);
  }
}
