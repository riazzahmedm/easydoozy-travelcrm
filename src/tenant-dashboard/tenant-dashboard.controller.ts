import {
  Controller,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { TenantDashboardService } from "./tenant-dashboard.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("Tenant Dashboard")
@ApiCookieAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("tenant/dashboard")
export class TenantDashboardController {
  constructor(
    private dashboardService: TenantDashboardService
  ) {}

  @Get()
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  getDashboard(@Req() req) {
    return this.dashboardService.getStats(
      req.user.tenantId
    );
  }
}
