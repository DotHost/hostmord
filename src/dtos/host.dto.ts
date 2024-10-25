import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Interval } from '@prisma/client';

class PricingDto {
  @ApiProperty({
    description:
      'Billing interval for the pricing plan. Options include monthly, yearly, etc.',
    enum: Interval,
    example: Interval.MONTH_1,
  })
  @IsEnum(Interval)
  @IsNotEmpty()
  interval: Interval;

  @ApiProperty({
    description: 'Price of the hosting plan. Must be a positive number.',
    example: 99.99,
  })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Currency in which the price is stated (e.g., USD, EUR).',
    example: 'USD',
  })
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Link to purchase the hosting plan. Must be a valid URL.',
    example: 'https://example.com/purchase',
  })
  @IsNotEmpty()
  @IsUrl()
  purchaseLink: string;

  @ApiProperty({
    description: 'Country where this pricing applies (e.g., US, DE).',
    example: 'US',
  })
  @IsNotEmpty()
  country: string;
}

export class CreateHostingPlanDto {
  @ApiProperty({
    description: 'Name of the hosting plan. Should be unique and descriptive.',
    example: 'Basic Hosting Plan',
  })
  @IsNotEmpty()
  planName: string;

  @ApiProperty({
    type: [PricingDto],
    description:
      'List of pricing options for different billing intervals and regions.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PricingDto)
  pricing: PricingDto[];
}
