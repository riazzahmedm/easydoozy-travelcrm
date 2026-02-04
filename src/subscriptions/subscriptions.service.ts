import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AssignSubscriptionDto } from "./dto/assign-subscription.dto";
import { SubscriptionStatus } from "@prisma/client";

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) { }

  async assertActiveSubscription(tenantId: string) {
    const subscription =
      await this.prisma.tenantSubscription.findUnique({
        where: { tenantId },
        include: { plan: true },
      });

    if (!subscription) {
      throw new ForbiddenException(
        "No active subscription for this tenant"
      );
    }

    if (
      subscription.status !== SubscriptionStatus.ACTIVE &&
      subscription.status !== SubscriptionStatus.TRIAL
    ) {
      throw new ForbiddenException(
        "Tenant subscription is not active"
      );
    }

    return subscription.plan.limits as Record<string, any>;
  }

  async assertWithinLimit(
    tenantId: string,
    limitKey: string,
    currentCount: number
  ) {
    const limits = await this.assertActiveSubscription(tenantId);

    const limit = limits?.[limitKey];

    // Unlimited if not defined
    if (limit === undefined || limit === null) {
      return;
    }

    if (currentCount >= limit) {
      throw new ForbiddenException(
        `Limit reached for ${limitKey} (max ${limit})`
      );
    }
  }

  async getTenantLimits(tenantId: string) {
    return this.assertActiveSubscription(tenantId);
  }

  async assign(dto: AssignSubscriptionDto) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id: dto.planId },
    });

    if (!plan || !plan.isActive) {
      throw new BadRequestException("Invalid or inactive plan");
    }

    return this.prisma.tenantSubscription.upsert({
      where: {
        tenantId: dto.tenantId,
      },
      update: {
        planId: dto.planId,
        status: SubscriptionStatus.ACTIVE,
        startAt: new Date(),
        endAt: dto.endAt ? new Date(dto.endAt) : null,
      },
      create: {
        tenantId: dto.tenantId,
        planId: dto.planId,
        status: SubscriptionStatus.ACTIVE,
        endAt: dto.endAt ? new Date(dto.endAt) : null,
      },
    });
  }

  async findByTenant(tenantId: string) {
    const subscription = await this.prisma.tenantSubscription.findUnique({
      where: { tenantId },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    return subscription;
  }

  async updateStatus(
    tenantId: string,
    status: SubscriptionStatus
  ) {
    await this.findByTenant(tenantId);

    return this.prisma.tenantSubscription.update({
      where: { tenantId },
      data: { status },
    });
  }
}
