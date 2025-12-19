import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  previewImageUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsInt()
  order: number;

  @IsInt()
  courseId: number;
}