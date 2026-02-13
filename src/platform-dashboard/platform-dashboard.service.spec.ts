import { Test, TestingModule } from '@nestjs/testing';
import { PlatformDashboardService } from './platform-dashboard.service';

describe('PlatformDashboardService', () => {
  let service: PlatformDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformDashboardService],
    }).compile();

    service = module.get<PlatformDashboardService>(PlatformDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
