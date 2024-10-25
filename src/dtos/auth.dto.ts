import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsNotEmpty,
  IsEnum,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

//create auth dto
export class CreateAuthDto {
  @ApiProperty({ example: 'John', required: true })
  @MinLength(3)
  @IsString()
  @IsOptional()
  firstname: string;

  @ApiProperty({ example: 'Doe', required: true })
  @MinLength(3)
  @IsString()
  @IsOptional()
  lastname: string;

  @ApiProperty({ example: 'john@example.com', required: true })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  email: string;

  @ApiProperty({ example: 'johndoe', required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'password123', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'password123', required: true })
  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}

//invite
export class InviteAuthDto {
  @ApiProperty({ example: 'john@example.com', required: true })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  email: string;
}

//update auth dto
export class UpdateAuthDto extends PartialType(CreateAuthDto) {}

//verify account auth dto
export class VerifyAuthDto {
  @ApiProperty({
    example: '1234567890/johndoe/john@example.com',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: '1234', required: true })
  @IsString()
  @IsNotEmpty()
  otp: string;
}

//reset password auth dto
export class ResetAuthDto {
  @ApiProperty({
    example: '1234567890/johndoe/john@example.com',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'password123', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'password123', required: true })
  @IsString()
  @IsNotEmpty()
  confirm_password: string;

  @ApiProperty({ example: '1234', required: true })
  @IsString()
  @IsNotEmpty()
  otp: string;
}

//login dto
export class AuthDto {
  @ApiProperty({ example: 'admin@example.com', required: true })
  @IsNotEmpty()
  @MinLength(3)
  identifier: string;

  @ApiProperty({ example: 'adminlogin', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}
