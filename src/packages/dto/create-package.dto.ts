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
  @ApiProperty({ example: 1 })
  @IsInt()
  dayNumber: number;

  @ApiProperty({ example: "Arrival and transfer" })
  @IsString()
  title: string;

  @ApiProperty({ example: "Pickup from airport and hotel check-in." })
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

  @ApiPropertyOptional({ example: "Best-selling honeymoon package in Goa." })
  @IsOptional()
  @IsString()
  overview?: string;

  @ApiPropertyOptional({ type: [String], example: ["Beach stay", "Private cab"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @ApiPropertyOptional({ type: [String], example: ["Breakfast", "Airport transfer"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inclusions?: string[];

  @ApiPropertyOptional({ type: [String], example: ["Lunch", "Personal expenses"] })
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

  @ApiPropertyOptional({ enum: ContentStatus, example: ContentStatus.DRAFT })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({ type: [String], example: ["tag-uuid-1", "tag-uuid-2"] })
  @IsOptional()
  @IsArray()
  tagIds?: string[];

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
