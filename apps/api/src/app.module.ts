import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CoursesModule, LessonsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
