import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateAgentDto {
  @ApiProperty({ example: "John Doe" })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "JohnDoe@tigerholidays.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Temp@123" })
  @MinLength(6)
  password: string;
}
