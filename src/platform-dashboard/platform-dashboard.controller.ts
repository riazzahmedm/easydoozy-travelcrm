import {
  Controller,
  Get,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { PlatformDashboardService } from "./platform-dashboard.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("Platform Dashboard")
@ApiCookieAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller("platform/dashboard")
export class PlatformDashboardController {
  constructor(
    private dashboardService: PlatformDashboardService
  ) {}

  @Get()
  getDashboard() {
    return this.dashboardService.getStats();
  }
}
