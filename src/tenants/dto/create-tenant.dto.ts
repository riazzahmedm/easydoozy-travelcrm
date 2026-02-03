import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

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
}
