import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { DestinationsModule } from './destinations/destinations.module';
import { UsersModule } from './users/users.module';
import { PackagesModule } from './packages/packages.module';
import { TagsModule } from './tags/tags.module';
import { PlansService } from './plans/plans.service';
import { PlansController } from './plans/plans.controller';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TenantDashboardModule } from './tenant-dashboard/tenant-dashboard.module';
import { PlatformDashboardService } from './platform-dashboard/platform-dashboard.service';
import { PlatformDashboardModule } from './platform-dashboard/platform-dashboard.module';
import { LeadsService } from './leads/leads.service';
import { LeadsController } from './leads/leads.controller';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [PrismaModule, AuthModule, TenantsModule, DestinationsModule, UsersModule, PackagesModule, TagsModule, PlansModule, SubscriptionsModule, TenantDashboardModule, PlatformDashboardModule, LeadsModule],
  controllers: [AppController, PlansController, SubscriptionsController, LeadsController],
  providers: [AppService, PlansService, SubscriptionsService, PlatformDashboardService, LeadsService],
})
export class AppModule {}
