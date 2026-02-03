import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdateAgentStatusDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  isActive: boolean;
}

