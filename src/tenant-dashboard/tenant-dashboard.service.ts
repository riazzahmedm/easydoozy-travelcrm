import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TenantDashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tenantId: string) {
    const [
      agents,
      destinations,
      packages,
      draftPackages,
      publishedPackages,
      subscription,
    ] = await Promise.all([
      this.prisma.user.count({
        where: {
          tenantId,
          role: "AGENT",
        },
      }),
      this.prisma.destination.count({
        where: { tenantId },
      }),
      this.prisma.package.count({
        where: { tenantId },
      }),
      this.prisma.package.count({
        where: {
          tenantId,
          status: "DRAFT",
        },
      }),
      this.prisma.package.count({
        where: {
          tenantId,
          status: "PUBLISHED",
        },
      }),
      this.prisma.tenantSubscription.findUnique({
        where: { tenantId },
        include: { plan: true },
      }),
    ]);

    return {
      stats: {
        agents,
        destinations,
        packages,
        draftPackages,
        publishedPackages,
      },
      subscription: subscription
        ? {
            status: subscription.status,
            plan: {
              id: subscription.plan.id,
              name: subscription.plan.name,
              limits: subscription.plan.limits,
            },
          }
        : null,
    };
  }
}
