import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { ContentStatus } from "@prisma/client";
import { Type } from "class-transformer";

class UpdateItineraryDayDto {
  @IsInt()
  dayNumber: number;

  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class UpdatePackageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceFrom?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  overview?: string;

  @ApiPropertyOptional({ enum: ContentStatus })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inclusions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exclusions?: string[];

  @ApiPropertyOptional({ type: [UpdateItineraryDayDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateItineraryDayDto)
  itinerary?: UpdateItineraryDayDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  tagIds?: string[];
}
