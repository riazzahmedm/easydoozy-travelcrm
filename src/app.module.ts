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

@Module({
  imports: [PrismaModule, AuthModule, TenantsModule, DestinationsModule, UsersModule, PackagesModule, TagsModule, PlansModule],
  controllers: [AppController, PlansController],
  providers: [AppService, PlansService],
})
export class AppModule {}
