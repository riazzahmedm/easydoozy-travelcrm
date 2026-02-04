import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ContentStatus } from "@prisma/client";
import { IsOptional, IsString, IsNotEmpty, IsEnum, IsArray } from "class-validator";

export class CreateDestinationDto {
  @ApiProperty({ example: "India" })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: "Goa" })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: "North Goa" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "north-goa" })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ContentStatus })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({ type: [String] })
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
