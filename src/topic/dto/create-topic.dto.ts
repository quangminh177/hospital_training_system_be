import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
  @IsNotEmpty()
  @IsString()
  topicName: string;

  @IsNotEmpty()
  @IsNumber()
  topicNo: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  topicWeight: number;

  @IsNotEmpty()
  @IsNumber()
  quizWeight: number;

  @IsNotEmpty()
  @IsNumber()
  assignmentWeight: number;

  @IsNotEmpty()
  @IsNumber()
  courseId: number;
}
