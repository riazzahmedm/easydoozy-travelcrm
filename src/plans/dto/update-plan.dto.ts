import { IsBoolean, IsObject, IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdatePlanDto {
  @ApiPropertyOptional({ example: "Starter" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: {
      maxAgents: 5,
      maxDestinations: 20,
      maxPackages: 50,
      mediaEnabled: true,
    },
  })
  @IsOptional()
  @IsObject()
  limits?: Record<string, any>;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
