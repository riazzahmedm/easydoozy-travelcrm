import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { SubscriptionStatus } from "@prisma/client";

export class UpdateSubscriptionStatusDto {
  @ApiProperty({ enum: SubscriptionStatus, example: SubscriptionStatus.ACTIVE })
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;
}
