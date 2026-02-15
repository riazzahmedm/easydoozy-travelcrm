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
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateLeadDto {
  @ApiProperty({ example: "Ana De Armas" })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: "ana@xyz.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: "+919999999999" })
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: "2026-03-15" })
  @IsOptional()
  @IsDateString()
  travelDate?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  travelers?: number;

  @ApiPropertyOptional({ example: 120000 })
  @IsOptional()
  @IsInt()
  budget?: number;

  @ApiPropertyOptional({ example: "Website" })
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

  @ApiPropertyOptional({ example: "" })
  @IsOptional()
  @IsUUID()
  assignedToId: string;

  @ApiPropertyOptional({ example: "Looking for family-friendly itinerary." })
  @IsOptional()
  @IsString()
  notes?: string;

  // Allow admin to optionally set status during creation
  @ApiPropertyOptional({ enum: LeadStatus, example: LeadStatus.NEW })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;
}
