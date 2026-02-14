import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AssignSubscriptionDto {
  @ApiProperty({ example: "" })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ example: "87eede60-759e-4eeb-9c59-09dd23b2a4ba" })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiPropertyOptional({ example: "2025-12-31" })
  @IsOptional()
  @IsDateString()
  endAt?: string;
}
