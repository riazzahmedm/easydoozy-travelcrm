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
import { PackagesService } from "./packages.service";
import { CreatePackageDto } from "./dto/create-package.dto";
import { UpdatePackageDto } from "./dto/update-package.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("Packages")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("packages")
export class PackagesController {
  constructor(private packagesService: PackagesService) {}

  @Post()
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  create(@Body() dto: CreatePackageDto, @Req() req) {
    return this.packagesService.create(dto, req.user.tenantId, req.user.role);
  }

  @Get()
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  findAll(@Req() req) {
    return this.packagesService.findAll(req.user.tenantId);
  }

  @Get(":id")
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  findOne(@Param("id") id: string, @Req() req) {
    return this.packagesService.findOne(id, req.user.tenantId);
  }

  @Patch(":id")
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  update(
    @Param("id") id: string,
    @Body() dto: UpdatePackageDto,
    @Req() req
  ) {
    return this.packagesService.update(id, dto, req.user.tenantId, req.user.role);
  }

  @Delete(":id")
  @Roles(UserRole.TENANT_ADMIN)
  remove(@Param("id") id: string, @Req() req) {
    return this.packagesService.remove(id, req.user.tenantId);
  }
}
