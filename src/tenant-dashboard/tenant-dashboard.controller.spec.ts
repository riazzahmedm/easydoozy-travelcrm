import { Test, TestingModule } from '@nestjs/testing';
import { TenantDashboardController } from './tenant-dashboard.controller';

describe('TenantDashboardController', () => {
  let controller: TenantDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantDashboardController],
    }).compile();

    controller = module.get<TenantDashboardController>(TenantDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
