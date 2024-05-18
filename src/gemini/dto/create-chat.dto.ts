import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({ description: 'Unique identifier for the chat' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Topic of the chat' })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({ description: 'Conversation language' })
  @IsString()
  @IsNotEmpty()
  conv_lan: string;

  @ApiProperty({ description: 'Expected language for the response' })
  @IsString()
  @IsNotEmpty()
  ex_lan: string;

  @ApiProperty({ description: 'Model to be used' })
  @IsString()
  @IsNotEmpty()
  model: string;
}
