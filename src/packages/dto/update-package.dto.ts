import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { ContentStatus } from "@prisma/client";
import { Type } from "class-transformer";

class UpdateItineraryDayDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  dayNumber: number;

  @ApiProperty({ example: "North Goa sightseeing" })
  @IsString()
  title: string;

  @ApiProperty({ example: "Visit beaches and local markets." })
  @IsString()
  description: string;
}

export class UpdatePackageDto {
  @ApiPropertyOptional({ example: "Goa Honeymoon Package" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: "5 Days / 4 Nights" })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ example: 25999 })
  @IsOptional()
  @IsNumber()
  priceFrom?: number;

  @ApiPropertyOptional({ example: "Updated package summary." })
  @IsOptional()
  @IsString()
  overview?: string;

  @ApiPropertyOptional({ enum: ContentStatus, example: ContentStatus.PUBLISHED })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({ type: [String], example: ["Beach stay", "Private transfer"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @ApiPropertyOptional({ type: [String], example: ["Breakfast", "Sightseeing"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inclusions?: string[];

  @ApiPropertyOptional({ type: [String], example: ["Flights", "Personal expenses"] })
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

  @ApiPropertyOptional({ type: [String], example: ["tag-uuid-1", "tag-uuid-2"] })
  @IsOptional()
  @IsArray()
  tagIds?: string[];

  @ApiPropertyOptional({ example: "destination-uuid" })
  @IsString()
  destinationId: string;

  @ApiPropertyOptional({ example: "https://cdn.site.com/cover.jpg" })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @ApiPropertyOptional({
    type: [String],
    example: [
      "https://cdn.site.com/img1.jpg",
      "https://cdn.site.com/img2.jpg"
    ]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryUrls?: string[];

}
