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

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  travelDate?: string;

  @IsOptional()
  @IsInt()
  travelers?: number;

  @IsOptional()
  @IsInt()
  budget?: number;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsUUID()
  destinationId?: string;

  @IsOptional()
  @IsUUID()
  packageId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;
}
