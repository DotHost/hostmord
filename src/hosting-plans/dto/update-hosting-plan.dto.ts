import { PartialType } from '@nestjs/swagger';
import { CreateHostingPlanDto } from './create-hosting-plan.dto';

export class UpdateHostingPlanDto extends PartialType(CreateHostingPlanDto) {}
