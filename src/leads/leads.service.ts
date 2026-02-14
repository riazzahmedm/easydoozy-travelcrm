import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LeadStatus, UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto, tenantId: string) {
    return this.prisma.lead.create({
      data: {
        ...dto,
        tenantId,
      },
    });
  }

  async findAll(
    tenantId: string,
    role: UserRole,
    userId: string
  ) {
    return this.prisma.lead.findMany({
      where: {
        tenantId,
        ...(role === UserRole.AGENT
          ? { assignedToId: userId }
          : {}),
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        destination: true,
        package: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(
    id: string,
    tenantId: string,
    role: UserRole,
    userId: string
  ) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId },
      include: {
        assignedTo: true,
        destination: true,
        package: true,
      },
    });

    if (!lead) throw new NotFoundException("Lead not found");

    if (
      role === UserRole.AGENT &&
      lead.assignedToId !== userId
    ) {
      throw new ForbiddenException(
        "You cannot access this lead"
      );
    }

    return lead;
  }

  async update(
    id: string,
    dto: UpdateLeadDto,
    tenantId: string,
    role: UserRole,
    userId: string
  ) {
    const lead = await this.findOne(
      id,
      tenantId,
      role,
      userId
    );

    return this.prisma.lead.update({
      where: { id: lead.id },
      data: dto,
    });
  }

  async assign(
    id: string,
    assignedToId: string,
    tenantId: string
  ) {
    return this.prisma.lead.update({
      where: { id },
      data: { assignedToId },
    });
  }

  async updateStatus(
    id: string,
    status: LeadStatus,
    tenantId: string,
    role: UserRole,
    userId: string
  ) {
    const lead = await this.findOne(
      id,
      tenantId,
      role,
      userId
    );

    return this.prisma.lead.update({
      where: { id: lead.id },
      data: { status },
    });
  }
}

