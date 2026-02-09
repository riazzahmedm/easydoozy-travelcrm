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
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("Tags")
@ApiCookieAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("tags")
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Post()
  @Roles(UserRole.TENANT_ADMIN)
  create(@Body() dto: CreateTagDto, @Req() req) {
    return this.tagsService.create(dto, req.user.tenantId);
  }

  @Get()
  @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
  findAll(@Req() req) {
    return this.tagsService.findAll(req.user.tenantId);
  }

  @Patch(":id")
  @Roles(UserRole.TENANT_ADMIN)
  update(
    @Param("id") id: string,
    @Body() dto: UpdateTagDto,
    @Req() req
  ) {
    return this.tagsService.update(id, dto, req.user.tenantId);
  }

  @Delete(":id")
  @Roles(UserRole.TENANT_ADMIN)
  remove(@Param("id") id: string, @Req() req) {
    return this.tagsService.remove(id, req.user.tenantId);
  }
}
