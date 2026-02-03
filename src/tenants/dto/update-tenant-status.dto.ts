import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { TenantStatus } from "@prisma/client";

export class UpdateTenantStatusDto {
  @ApiProperty({ enum: TenantStatus })
  @IsEnum(TenantStatus)
  status: TenantStatus;
}
