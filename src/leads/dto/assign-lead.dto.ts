import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class AssignLeadDto {
  @ApiProperty({ example: "" })
  @IsUUID()
  assignedToId: string;
}
