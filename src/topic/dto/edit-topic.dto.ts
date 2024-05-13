import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditTopicDto {
  @IsOptional()
  @IsString()
  topicName?: string;

  @IsOptional()
  @IsNumber()
  topicNo?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  topicWeight?: number;

  @IsOptional()
  @IsNumber()
  quizWeight?: number;

  @IsOptional()
  @IsNumber()
  assignmentWeight?: number;

  @IsOptional()
  @IsNumber()
  courseId?: number;
}
