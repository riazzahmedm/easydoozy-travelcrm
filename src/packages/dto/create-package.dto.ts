import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ContentStatus } from "@prisma/client";

export class CreatePackageDto {
  @ApiProperty({ example: "Goa Honeymoon Package" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "goa-honeymoon" })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: "5 Days / 4 Nights" })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({ example: 24999 })
  @IsNumber()
  priceFrom: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  overview?: string;

  @ApiProperty({ example: "destination-uuid" })
  @IsString()
  @IsNotEmpty()
  destinationId: string;

  @ApiPropertyOptional({ enum: ContentStatus })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}
