import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDestinationDto } from "./dto/create-destination.dto";
import { UpdateDestinationDto } from "./dto/update-destination.dto";
import { UserRole } from "@prisma/client";

@Injectable()
export class DestinationsService {
  constructor(private prisma: PrismaService) { }

  private async validateTags(tagIds: string[], tenantId: string) {
    const count = await this.prisma.tag.count({
      where: {
        id: { in: tagIds },
        tenantId,
      },
    });

    if (count !== tagIds.length) {
      throw new BadRequestException("Invalid tags supplied");
    }
  }

  async create(dto: CreateDestinationDto, tenantId: string, role: UserRole) {
    // Slug uniqueness per tenant
    const existing = await this.prisma.destination.findFirst({
      where: {
        tenantId,
        slug: dto.slug,
      },
    });

    if (existing) {
      throw new BadRequestException(
        "Destination slug already exists for this tenant"
      );
    }

    if (dto.tagIds?.length) {
      await this.validateTags(dto.tagIds, tenantId);
    }

    const status =
      role === UserRole.AGENT ? "DRAFT" : dto.status ?? "DRAFT";


    return this.prisma.destination.create({
      data: {
        country: dto.country,
        city: dto.city,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        status,
        tenantId,
        tags: dto.tagIds
          ? {
            connect: dto.tagIds.map((id) => ({ id })),
          }
          : undefined,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.destination.findMany({
      where: { tenantId },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, tenantId: string) {
    const destination = await this.prisma.destination.findFirst({
      where: { id, tenantId },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!destination) {
      throw new NotFoundException("Destination not found");
    }

    return destination;
  }

  async update(
    id: string,
    dto: UpdateDestinationDto,
    tenantId: string,
    role: UserRole
  ) {
    const destination = await this.findOne(id, tenantId);

    if (dto.tagIds) {
      await this.validateTags(dto.tagIds, tenantId);
    }

    if (
      role === UserRole.AGENT &&
      dto.status === "PUBLISHED"
    ) {
      throw new ForbiddenException(
        "Agents cannot publish destinations"
      );
    }

    return this.prisma.destination.update({
      where: { id: destination.id },
      data: {
        ...dto,
        tags: dto.tagIds
          ? {
            set: dto.tagIds.map((id) => ({ id })),
          }
          : undefined,
      },
    });
  }

  async remove(id: string, tenantId: string) {
    const destination = await this.findOne(id, tenantId);

    return this.prisma.destination.delete({
      where: { id: destination.id },
    });
  }
}
