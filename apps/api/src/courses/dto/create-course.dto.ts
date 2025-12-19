import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray } from 'class-validator';

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

  @IsString()
  authorEmail: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}