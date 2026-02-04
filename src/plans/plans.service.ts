import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePlanDto) {
    const existing = await this.prisma.plan.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException("Plan code already exists");
    }

    return this.prisma.plan.create({
      data: {
        name: dto.name,
        code: dto.code,
        limits: dto.limits,
        isActive: dto.isActive,
      },
    });
  }

  async findAll() {
    return this.prisma.plan.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException("Plan not found");
    }

    return plan;
  }

  async update(id: string, dto: UpdatePlanDto) {
    await this.findOne(id);

    return this.prisma.plan.update({
      where: { id },
      data: {
        name: dto.name,
        limits: dto.limits,
        isActive: dto.isActive,
      },
    });
  }
}
