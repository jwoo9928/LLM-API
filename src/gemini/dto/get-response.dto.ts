import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Scores } from "src/types/llmObjs";

export class GetResponseDto {
  @ApiProperty({ description: "Answer text" })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({ description: "Unique identifier for the chat" })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: "Unique identifier for the chat" })
  @IsString()
  azure_scores: Scores[];
}
