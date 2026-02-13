import { Test, TestingModule } from '@nestjs/testing';
import { PlatformDashboardController } from './platform-dashboard.controller';

describe('PlatformDashboardController', () => {
  let controller: PlatformDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformDashboardController],
    }).compile();

    controller = module.get<PlatformDashboardController>(PlatformDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
