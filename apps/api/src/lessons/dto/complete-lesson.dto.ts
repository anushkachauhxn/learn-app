import { IsInt } from 'class-validator';

export class CompleteLessonDto {
  @IsInt()
  userId: number;
}