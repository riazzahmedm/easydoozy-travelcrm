import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {
  @ApiProperty({ example: "Honeymoon" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "honeymoon" })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
