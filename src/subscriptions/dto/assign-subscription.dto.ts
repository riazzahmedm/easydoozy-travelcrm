import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AssignSubscriptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiPropertyOptional({ example: "2025-12-31" })
  @IsOptional()
  @IsDateString()
  endAt?: string;
}
