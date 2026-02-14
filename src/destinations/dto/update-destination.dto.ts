import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { ContentStatus } from "@prisma/client";

export class UpdateDestinationDto {
  @ApiPropertyOptional({ example: "India" })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: "Goa" })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: "North Goa" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: "Beach destination popular for holidays." })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ContentStatus, example: ContentStatus.PUBLISHED })
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
