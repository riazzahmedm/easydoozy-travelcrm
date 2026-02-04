import { IsBoolean, IsNotEmpty, IsObject, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePlanDto {
  @ApiProperty({ example: "Starter" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "STARTER" })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: {
      maxAgents: 5,
      maxDestinations: 20,
      maxPackages: 50,
      mediaEnabled: true,
    },
  })
  @IsObject()
  limits: Record<string, any>;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;
}
