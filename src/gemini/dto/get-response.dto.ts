import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetResponseDto {
  @ApiProperty({ description: "Answer text" })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({ description: "Unique identifier for the chat" })
  @IsString()
  @IsNotEmpty()
  id: string;
}
