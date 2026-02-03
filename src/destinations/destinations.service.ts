import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDestinationDto } from "./dto/create-destination.dto";
import { UpdateDestinationDto } from "./dto/update-destination.dto";

@Injectable()
export class DestinationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDestinationDto, tenantId: string) {
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

    return this.prisma.destination.create({
      data: {
        ...dto,
        status: dto.status ?? "DRAFT",
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.destination.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, tenantId: string) {
    const destination = await this.prisma.destination.findFirst({
      where: { id, tenantId },
    });

    if (!destination) {
      throw new NotFoundException("Destination not found");
    }

    return destination;
  }

  async update(
    id: string,
    dto: UpdateDestinationDto,
    tenantId: string
  ) {
    const destination = await this.findOne(id, tenantId);

    return this.prisma.destination.update({
      where: { id: destination.id },
      data: dto,
    });
  }

  async remove(id: string, tenantId: string) {
    const destination = await this.findOne(id, tenantId);

    return this.prisma.destination.delete({
      where: { id: destination.id },
    });
  }
}
