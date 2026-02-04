import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePackageDto } from "./dto/create-package.dto";
import { UpdatePackageDto } from "./dto/update-package.dto";
import { UserRole } from "@prisma/client";

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

  private async createCoverImage(
    tenantId: string,
    packageId: string,
    url: string
  ) {
    const pkg = await this.prisma.package.findUnique({
      where: { id: packageId },
      select: { coverImageId: true },
    });

    if (pkg?.coverImageId) {
      await this.prisma.media.delete({
        where: { id: pkg.coverImageId },
      });
    }

    const media = await this.prisma.media.create({
      data: {
        tenantId,
        url,
        order: 0,
      },
    });

    await this.prisma.package.update({
      where: { id: packageId },
      data: {
        coverImage: {
          connect: { id: media.id },
        },
      },
    });
  }

  private async replaceGallery(
    tenantId: string,
    packageId: string,
    urls: string[]
  ) {
    await this.prisma.media.deleteMany({
      where: {
        tenantId,
        packageId,
        NOT: {
          packageCover: { isNot: null },
        },
      },
    });

    await this.prisma.media.createMany({
      data: urls.map((url, index) => ({
        tenantId,
        url,
        order: index,
        packageId,
      })),
    });
  }

  async create(dto: CreatePackageDto, tenantId: string, role: UserRole) {
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

    const status =
      role === UserRole.AGENT ? "DRAFT" : dto.status ?? "DRAFT";

    const pkg = await this.prisma.package.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        duration: dto.duration,
        priceFrom: dto.priceFrom,
        overview: dto.overview,
        destinationId: dto.destinationId,
        tenantId,
        status,
        highlights: dto.highlights ?? [],
        inclusions: dto.inclusions ?? [],
        exclusions: dto.exclusions ?? [],
        tags: dto.tagIds
          ? {
            connect: dto.tagIds.map((id) => ({ id })),
          }
          : undefined,
        itinerary: dto.itinerary
          ? {
            create: dto.itinerary.map(day => ({
              dayNumber: day.dayNumber,
              title: day.title,
              description: day.description,
            })),
          }
          : undefined,
      },
    });

    if (dto.coverImageUrl) {
      await this.createCoverImage(
        tenantId,
        pkg.id,
        dto.coverImageUrl
      );
    }

    if (dto.galleryUrls?.length) {
      await this.replaceGallery(
        tenantId,
        pkg.id,
        dto.galleryUrls
      );
    }

    return pkg;
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
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        coverImage: {
          select: { url: true, altText: true },
        },
        media: {
          orderBy: { order: "asc" },
          select: { url: true, altText: true },
        },
        itinerary: {
          orderBy: { dayNumber: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }


  async findOne(id: string, tenantId: string) {
    const pkg = await this.prisma.package.findFirst({
      where: { id, tenantId },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        coverImage: {
          select: { url: true, altText: true },
        },
        media: {
          orderBy: { order: "asc" },
          select: { url: true, altText: true },
        },
        itinerary: {
          orderBy: { dayNumber: "asc" },
        },
      },
    });

    if (!pkg) {
      throw new NotFoundException("Package not found");
    }

    return pkg;
  }


  async update(id: string, dto: UpdatePackageDto, tenantId: string, role: UserRole) {
    const pkg = await this.findOne(id, tenantId);

    if (dto.tagIds) {
      await this.validateTags(dto.tagIds, tenantId);
    }

    if (
      role === UserRole.AGENT &&
      dto.status === "PUBLISHED"
    ) {
      throw new ForbiddenException(
        "Agents cannot publish packages"
      );
    }

    const updated = this.prisma.package.update({
      where: { id: pkg.id },
      data: {
        name: dto.name,
        duration: dto.duration,
        priceFrom: dto.priceFrom,
        overview: dto.overview,
        status: dto.status,
        highlights: dto.highlights,
        inclusions: dto.inclusions,
        exclusions: dto.exclusions,
        tags: dto.tagIds
          ? {
            set: dto.tagIds.map((id) => ({ id })),
          }
          : undefined,
        itinerary: dto.itinerary
          ? {
            deleteMany: {},
            create: dto.itinerary.map(day => ({
              dayNumber: day.dayNumber,
              title: day.title,
              description: day.description,
            })),
          }
          : undefined,
      },
    });

    if (dto.coverImageUrl) {
      await this.createCoverImage(
        tenantId,
        pkg.id,
        dto.coverImageUrl
      );
    }

    if (dto.galleryUrls) {
      await this.replaceGallery(
        tenantId,
        pkg.id,
        dto.galleryUrls
      );
    }

    return updated;
  }

  async remove(id: string, tenantId: string) {
    const pkg = await this.findOne(id, tenantId);

    return this.prisma.package.delete({
      where: { id: pkg.id },
    });
  }
}
