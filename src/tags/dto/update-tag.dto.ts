import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateTagDto {
  @ApiPropertyOptional({ example: "Adventure" })
  @IsOptional()
  @IsString()
  name?: string;
}
