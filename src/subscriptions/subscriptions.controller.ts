import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SubscriptionsService } from "./subscriptions.service";
import { AssignSubscriptionDto } from "./dto/assign-subscription.dto";
import { UpdateSubscriptionStatusDto } from "./dto/update-subscription-status.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("Tenant Subscriptions")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post("assign")
  assign(@Body() dto: AssignSubscriptionDto) {
    return this.subscriptionsService.assign(dto);
  }

  @Get("tenant/:tenantId")
  findByTenant(@Param("tenantId") tenantId: string) {
    return this.subscriptionsService.findByTenant(tenantId);
  }

  @Patch("tenant/:tenantId/status")
  updateStatus(
    @Param("tenantId") tenantId: string,
    @Body() dto: UpdateSubscriptionStatusDto
  ) {
    return this.subscriptionsService.updateStatus(
      tenantId,
      dto.status
    );
  }
}
