import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TenantStatus, SubscriptionStatus } from "@prisma/client";

@Injectable()
export class PlatformDashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalTenants,
      activeTenants,
      suspendedTenants,
      totalAgents,
      totalDestinations,
      totalPackages,
      publishedPackages,
      activeSubscriptions,
      trialSubscriptions,
      suspendedSubscriptions,
      tenants,
      packages,
    ] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.tenant.count({
        where: { status: TenantStatus.ACTIVE },
      }),
      this.prisma.tenant.count({
        where: { status: TenantStatus.SUSPENDED },
      }),
      this.prisma.user.count({
        where: { role: "AGENT" },
      }),
      this.prisma.destination.count(),
      this.prisma.package.count(),
      this.prisma.package.count({
        where: { status: "PUBLISHED" },
      }),
      this.prisma.tenantSubscription.count({
        where: { status: SubscriptionStatus.ACTIVE },
      }),
      this.prisma.tenantSubscription.count({
        where: { status: SubscriptionStatus.TRIAL },
      }),
      this.prisma.tenantSubscription.count({
        where: { status: SubscriptionStatus.SUSPENDED },
      }),
      this.prisma.tenant.findMany({
        select: { createdAt: true },
      }),
      this.prisma.package.findMany({
        select: { createdAt: true },
      }),
    ]);

    return {
      overview: {
        totalTenants,
        activeTenants,
        suspendedTenants,
        totalAgents,
        totalDestinations,
        totalPackages,
        publishedPackages,
      },
      subscriptions: {
        activeSubscriptions,
        trialSubscriptions,
        suspendedSubscriptions,
      },
      growth: {
        tenants: this.groupByMonth(tenants),
        packages: this.groupByMonth(packages),
      },
    };
  }

  private groupByMonth(records: { createdAt: Date }[]) {
    const map: Record<string, number> = {};

    records.forEach((r) => {
      const month = r.createdAt.toISOString().slice(0, 7); // YYYY-MM
      map[month] = (map[month] || 0) + 1;
    });

    return Object.entries(map).map(([month, count]) => ({
      month,
      count,
    }));
  }
}
