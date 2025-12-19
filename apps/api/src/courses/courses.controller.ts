import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('create')
  create(@Body() data: CreateCourseDto) {
    return this.coursesService.create(data);
  }

  @Post('update/:id')
  update(@Param('id') id: string, @Body() data: UpdateCourseDto) {
    return this.coursesService.update(+id, data);
  }

  @Post('delete/:id')
  delete(@Param('id') id: string) {
    return this.coursesService.delete(+id);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }
}
