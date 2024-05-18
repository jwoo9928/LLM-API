import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetResponseDto {
  @ApiProperty({ description: 'Answer text' })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({ description: 'Unique identifier for the chat' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Language of the response' })
  @IsString()
  @IsNotEmpty()
  lan: string;

  @ApiProperty({ description: 'Model to be used' })
  @IsString()
  @IsNotEmpty()
  model: string;
}
