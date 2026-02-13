import { Module } from '@nestjs/common';
import { PlatformDashboardController } from './platform-dashboard.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlatformDashboardService } from './platform-dashboard.service';

@Module({
  controllers: [PlatformDashboardController],
  providers: [PlatformDashboardService, PrismaService]
})
export class PlatformDashboardModule {}
