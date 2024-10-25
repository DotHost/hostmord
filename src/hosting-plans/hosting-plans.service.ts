import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateHostingPlanDto } from 'src/dtos';
import { handleResponse } from 'src/common';

@Injectable()
export class HostingPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async createHostingPlan(dto: CreateHostingPlanDto) {
    const { planName, pricing } = dto;

    const hostingPlan = await this.prisma.hostingPlan.create({
      data: {
        planName,
        pricing: {
          create: pricing.map((p) => ({
            interval: p.interval,
            price: p.price,
            currency: p.currency,
            country: p.country,
            purchaseLink: p.purchaseLink,
          })),
        },
      },
      include: { pricing: true },
    });

    if (!hostingPlan) {
      throw new handleResponse(
        HttpStatus.BAD_REQUEST,
        'Hosting Plan could not be created',
      );
    }

    return new handleResponse(
      HttpStatus.OK,
      'Hosting Plan was created successfully',
      hostingPlan,
    );
  }

  async getAllHostingPlans() {
    return this.prisma.hostingPlan.findMany({
      include: { pricing: true },
    });
  }
}
