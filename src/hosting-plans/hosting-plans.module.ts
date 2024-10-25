import { Module } from '@nestjs/common';
import { HostingPlanService } from './hosting-plans.service';
import { HostingPlanController } from './hosting-plans.controller';

@Module({
  controllers: [HostingPlanController],
  providers: [HostingPlanService],
})
export class HostingPlansModule {}
