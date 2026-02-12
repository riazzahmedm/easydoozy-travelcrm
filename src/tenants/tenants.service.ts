import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { TenantStatus, UserRole } from "@prisma/client";

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) { }

  async createTenantWithAdmin(dto: CreateTenantDto) {
    // 1. Check tenant slug uniqueness
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.slug },
    });

    if (existingTenant) {
      throw new BadRequestException("Tenant slug already exists");
    }

    // 2. Check admin email uniqueness
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.adminEmail },
    });

    if (existingUser) {
      throw new BadRequestException("Admin email already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

    // 3. Atomic creation
    return this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: dto.tenantName,
          slug: dto.slug,
          status: TenantStatus.ACTIVE,
        },
      });

      const admin = await tx.user.create({
        data: {
          name: dto.adminName,
          email: dto.adminEmail,
          password: hashedPassword,
          role: UserRole.TENANT_ADMIN,
          tenantId: tenant.id,
        },
      });

      return {
        tenant,
        admin: {
          id: admin.id,
          email: admin.email,
          role: admin.role,
        },
      };
    });
  }

  async findAllTenants() {
    return this.prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            users: true,
            destinations: true,
            packages: true,
          },
        },
      },
    });
  }

  async findTenantById(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
        _count: {
          select: {
            users: true,
            destinations: true,
            packages: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    return tenant;
  }

  async updateTenantStatus(tenantId: string, status: TenantStatus) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status },
    });
  }
}
