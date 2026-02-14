
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateTenantDto {
  @ApiPropertyOptional({ example: "https://cdn.site.com/logo.png" })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ example: "#0f172a" })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: "John Doe" })
  @IsOptional()
  @IsString()
  adminName?: string;

  @ApiPropertyOptional({ example: "johndoe@abc.com" })
  @IsOptional()
  @IsEmail()
  adminEmail?: string;
}
