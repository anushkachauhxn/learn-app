import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post('create')
  create(@Body() data:  CreateLessonDto) {
    return this.lessonsService.create(data);
  }

  @Post('update/:id')
  update(@Param('id') id: string, @Body() data: UpdateLessonDto) {
    return this.lessonsService.update(+id, data);
  }

  @Post('delete/:id')
  delete(@Param('id') id: string) {
    return this.lessonsService.delete(+id);
  }

  @Get('all/:courseId')
  findAll(@Param('courseId') courseId: string) {
    return this.lessonsService.findAll(+courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.lessonsService.findOne(+id, +userId);
  }

  @Post('complete/:id')
  markAsComplete(@Param('id') id: string, @Body('userId') userId: number) {
    return this.lessonsService.markAsComplete(+id, userId);
  }
}
