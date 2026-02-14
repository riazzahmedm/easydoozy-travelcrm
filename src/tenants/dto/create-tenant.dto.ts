import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateTenantDto {
  @ApiProperty({ example: "Tiger Holidays" })
  @IsString()
  @IsNotEmpty()
  tenantName: string;

  @ApiProperty({ example: "tiger-holidays" })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: "Admin User" })
  @IsString()
  @IsNotEmpty()
  adminName: string;

  @ApiProperty({ example: "admin@tigerholidays.com" })
  @IsEmail()
  adminEmail: string;

  @ApiProperty({ example: "Admin@123" })
  @MinLength(6)
  adminPassword: string;

  @ApiPropertyOptional({ example: "https://cdn.site.com/logo.png" })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ example: "#0f172a" })
  @IsOptional()
  @IsString()
  color?: string;
}
