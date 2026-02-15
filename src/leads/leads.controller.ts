import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-status.dto';

@ApiTags("Leads")
@ApiCookieAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("leads")
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Post()
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  create(@Body() dto: CreateLeadDto, @Req() req) {
    return this.leadsService.create(dto, req.user.tenantId);
  }

  @Get()
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  findAll(@Req() req) {
    return this.leadsService.findAll(
      req.user.tenantId,
      req.user.role,
      req.user.id
    );
  }

  @Get(":id")
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  findOne(@Param("id") id: string, @Req() req) {
    return this.leadsService.findOne(
      id,
      req.user.tenantId,
      req.user.role,
      req.user.id
    );
  }

  @Patch(":id")
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  update(
    @Param("id") id: string,
    @Body() dto: UpdateLeadDto,
    @Req() req
  ) {
    return this.leadsService.update(
      id,
      dto,
      req.user.tenantId,
      req.user.role,
      req.user.id
    );
  }

  @Patch(":id/status")
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateLeadStatusDto,
    @Req() req
  ) {
    return this.leadsService.updateStatus(
      id,
      dto.status,
      req.user.tenantId,
      req.user.role,
      req.user.id
    );
  }
}

