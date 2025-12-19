import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  previewImageUrl?: string;

  @IsInt()
  authorId: number;
}