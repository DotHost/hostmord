import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HostingPlanService } from './hosting-plans.service';
import { CreateHostingPlanDto } from 'src/dtos';

@ApiTags('Hosting Plans')
@Controller('hosting-plans')
export class HostingPlanController {
  constructor(private readonly hostingPlanService: HostingPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new hosting plan' })
  async createHostingPlan(@Body() dto: CreateHostingPlanDto) {
    return this.hostingPlanService.createHostingPlan(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all hosting plans' })
  async getAllHostingPlans() {
    return this.hostingPlanService.getAllHostingPlans();
  }
}
