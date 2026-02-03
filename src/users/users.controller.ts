import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateAgentDto } from "./dto/create-agent.dto";
import { UpdateAgentStatusDto } from "./dto/update-agent-status.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("Users (Agents)")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles(UserRole.TENANT_ADMIN)
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post("agents")
  createAgent(@Body() dto: CreateAgentDto, @Req() req) {
    return this.usersService.createAgent(dto, req.user.tenantId);
  }

  @Get("agents")
  listAgents(@Req() req) {
    return this.usersService.listAgents(req.user.tenantId);
  }

  @Patch("agents/:id/status")
  updateStatus(
    @Param("id") agentId: string,
    @Body() dto: UpdateAgentStatusDto,
    @Req() req
  ) {
    return this.usersService.updateAgentStatus(
      agentId,
      dto.isActive,
      req.user.tenantId
    );
  }
}
