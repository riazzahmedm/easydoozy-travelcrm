import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePackageDto } from "./dto/create-package.dto";
import { UpdatePackageDto } from "./dto/update-package.dto";

@Injectable()
export class PackagesService {
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

  async create(dto: CreatePackageDto, tenantId: string) {
    // 1. Ensure destination exists and belongs to tenant
    const destination = await this.prisma.destination.findFirst({
      where: {
        id: dto.destinationId,
        tenantId,
      },
    });

    if (!destination) {
      throw new BadRequestException("Invalid destination");
    }

    // 2. Slug uniqueness per tenant
    const existing = await this.prisma.package.findFirst({
      where: {
        tenantId,
        slug: dto.slug,
      },
    });

    if (existing) {
      throw new BadRequestException(
        "Package slug already exists for this tenant"
      );
    }

    if (dto.tagIds?.length) {
      await this.validateTags(dto.tagIds, tenantId);
    }

    return this.prisma.package.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        duration: dto.duration,
        priceFrom: dto.priceFrom,
        overview: dto.overview,
        destinationId: dto.destinationId,
        tenantId,
        status: dto.status ?? "DRAFT",
        tags: dto.tagIds
          ? {
            connect: dto.tagIds.map((id) => ({ id })),
          }
          : undefined,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.package.findMany({
      where: { tenantId },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, tenantId: string) {
    const pkg = await this.prisma.package.findFirst({
      where: { id, tenantId },
      include: {
        destination: true,
      },
    });

    if (!pkg) {
      throw new NotFoundException("Package not found");
    }

    return pkg;
  }

  async update(id: string, dto: UpdatePackageDto, tenantId: string) {
    const pkg = await this.findOne(id, tenantId);

    if (dto.tagIds) {
      await this.validateTags(dto.tagIds, tenantId);
    }


    return this.prisma.package.update({
      where: { id: pkg.id },
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
    const pkg = await this.findOne(id, tenantId);

    return this.prisma.package.delete({
      where: { id: pkg.id },
    });
  }
}
