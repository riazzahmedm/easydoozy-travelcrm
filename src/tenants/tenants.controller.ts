import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { TenantsService } from "./tenants.service";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantStatusDto } from "./dto/update-tenant-status.dto";
import { AuthGuard } from "@nestjs/passport";
import { UserRole } from "@prisma/client";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";

@ApiTags("Tenants")
@ApiCookieAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller("tenants")
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Post()
  createTenant(@Body() dto: CreateTenantDto) {
    return this.tenantsService.createTenantWithAdmin(dto);
  }

  @Get()
  listTenants() {
    return this.tenantsService.findAllTenants();
  }

  @Get(":id")
  getTenant(@Param("id") tenantId: string) {
    return this.tenantsService.findTenantById(tenantId);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") tenantId: string,
    @Body() dto: UpdateTenantStatusDto
  ) {
    return this.tenantsService.updateTenantStatus(tenantId, dto.status);
  }
}
