import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ContentStatus } from "@prisma/client";
import { Type } from "class-transformer";

class CreateItineraryDayDto {
  @IsInt()
  dayNumber: number;

  @IsString()
  title: string;

  @IsString()
  description: string;
}

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

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inclusions?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exclusions?: string[];

  @ApiPropertyOptional({ type: [CreateItineraryDayDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItineraryDayDto)
  itinerary?: CreateItineraryDayDto[];

  @ApiProperty({ example: "destination-uuid" })
  @IsString()
  @IsNotEmpty()
  destinationId: string;

  @ApiPropertyOptional({ enum: ContentStatus })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  tagIds?: string[];
}
