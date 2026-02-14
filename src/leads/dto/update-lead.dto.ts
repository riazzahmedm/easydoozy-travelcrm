import {
  IsString,
  IsOptional,
  IsEmail,
  IsInt,
  IsUUID,
  IsEnum,
  IsDateString,
} from "class-validator";
import { LeadStatus } from "@prisma/client";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateLeadDto {
  @ApiPropertyOptional({ example: "Ana De Armas" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: "ana@xyz.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "+919999999999" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: "2026-03-15" })
  @IsOptional()
  @IsDateString()
  travelDate?: string;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsInt()
  travelers?: number;

  @ApiPropertyOptional({ example: 180000 })
  @IsOptional()
  @IsInt()
  budget?: number;

  @ApiPropertyOptional({ example: "Referral" })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ example: "" })
  @IsOptional()
  @IsUUID()
  destinationId?: string;

  @ApiPropertyOptional({ example: "" })
  @IsOptional()
  @IsUUID()
  packageId?: string;

  @ApiPropertyOptional({ example: "Customer requested hotel upgrade." })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: LeadStatus, example: LeadStatus.CONTACTED })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;
}
