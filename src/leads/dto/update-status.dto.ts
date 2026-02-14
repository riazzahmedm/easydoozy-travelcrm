import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { LeadStatus } from "@prisma/client";

export class UpdateLeadStatusDto {
  @ApiProperty({ enum: LeadStatus, example: LeadStatus.QUALIFIED })
  @IsEnum(LeadStatus)
  status: LeadStatus;
}
