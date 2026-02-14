
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateTenantDto {
  @ApiProperty({ example: "https://.." })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ example: "#000" })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: "John Doe" })
  @IsOptional()
  @IsString()
  adminName?: string;

  @ApiProperty({ example: "johndoe@abc.com" })
  @IsOptional()
  @IsEmail()
  adminEmail?: string;
}
