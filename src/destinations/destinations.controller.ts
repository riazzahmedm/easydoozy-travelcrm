import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DestinationsService } from "./destinations.service";
import { CreateDestinationDto } from "./dto/create-destination.dto";
import { UpdateDestinationDto } from "./dto/update-destination.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("Destinations")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("destinations")
export class DestinationsController {
  constructor(private destinationsService: DestinationsService) {}

  @Post()
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  create(@Body() dto: CreateDestinationDto, @Req() req) {
    return this.destinationsService.create(dto, req.user.tenantId, req.user.role);
  }

  @Get()
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  findAll(@Req() req) {
    return this.destinationsService.findAll(req.user.tenantId);
  }

  @Get(":id")
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  findOne(@Param("id") id: string, @Req() req) {
    return this.destinationsService.findOne(id, req.user.tenantId);
  }

  @Patch(":id")
 @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  update(
    @Param("id") id: string,
    @Body() dto: UpdateDestinationDto,
    @Req() req
  ) {
    return this.destinationsService.update(id, dto, req.user.tenantId, req.user.role);
  }

  @Delete(":id")
  @Roles(UserRole.TENANT_ADMIN)
  remove(@Param("id") id: string, @Req() req) {
    return this.destinationsService.remove(id, req.user.tenantId);
  }
}
