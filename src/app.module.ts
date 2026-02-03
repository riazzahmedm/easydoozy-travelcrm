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

@Module({
  imports: [PrismaModule, AuthModule, TenantsModule, DestinationsModule, UsersModule, PackagesModule, TagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
