import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTagDto, tenantId: string) {
    const existing = await this.prisma.tag.findFirst({
      where: {
        tenantId,
        slug: dto.slug,
      },
    });

    if (existing) {
      throw new BadRequestException(
        "Tag with this slug already exists"
      );
    }

    return this.prisma.tag.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.tag.findMany({
      where: { tenantId },
      orderBy: { name: "asc" },
    });
  }

  async update(id: string, dto: UpdateTagDto, tenantId: string) {
    const tag = await this.prisma.tag.findFirst({
      where: { id, tenantId },
    });

    if (!tag) {
      throw new NotFoundException("Tag not found");
    }

    return this.prisma.tag.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }

  async remove(id: string, tenantId: string) {
    const tag = await this.prisma.tag.findFirst({
      where: { id, tenantId },
    });

    if (!tag) {
      throw new NotFoundException("Tag not found");
    }

    return this.prisma.tag.delete({
      where: { id },
    });
  }
}
