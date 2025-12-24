import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";

@Injectable()
export class LessonsService {
  constructor(private db: DatabaseService) {}

  async create(data: CreateLessonDto) {
    return this.db.prisma.lesson.create({ data });
  }
  
  async update(id: number, data: UpdateLessonDto) {
    return this.db.prisma.lesson.update({
      where: { id, deleted: false },
      data: data
    });
  }
  
  async delete(id: number) {
    return this.db.prisma.lesson.update({
      where: { id, deleted: false },
      data: { deleted: true }
    });
  }
  
  async findAll(courseId: number) {
    return this.db.prisma.lesson.findMany({
      where: {
        courseId,
        deleted: false
      },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        previewImageUrl: true,
        videoUrl: true
      }
    });
  }

  async findOne(id: number, userId: number) {
    const lesson = await this.db.prisma.lesson.findUnique({
      where: { id, deleted: false },
      select: {
        id: true,
        title: true,
        description: true,
        previewImageUrl: true,
        videoUrl: true,
        order: true,
        courseId: true
      }
    });
    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    const lessonStatus = await this.getLessonStatus(lesson, userId);
    return {
      ...lesson,
      ...lessonStatus
    };
  }

  async markAsComplete(id: number, userId: number) {
    const lesson = await this.db.prisma.lesson.findUnique({
      where: { id, deleted: false },
      select: { id: true, courseId: true }
    });
    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    const lessonStatus = await this.getLessonStatus(lesson, userId);
    if (!lessonStatus.enrolled) {
      throw new NotFoundException("You are not enrolled in this course");
    }
    if (lessonStatus.completed) {
      throw new ConflictException("Lesson already completed");
    }

    return this.db.prisma.userCourse.update({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: lesson.courseId
        },
        deleted: false
      },
      data: {
        completed: {
          connect: { id }
        }
      }
    });
  }

  private async getLessonStatus(lesson: any, userId: number) : Promise<any> {
    const userCourse = await this.db.prisma.userCourse.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: lesson.courseId
        },
        deleted: false
      },
      select: {
        completed: {
          select: { id: true }
        }
      }
    });

    if (userCourse) {
      if (userCourse.completed) {
        const completedLessons = userCourse.completed.map((completedLesson: any) => completedLesson.id);
        if (completedLessons.includes(lesson.id)) {
          return { enrolled: true, completed: true };
        }
      }
      return { enrolled: true, completed: false };
    }
    return { enrolled: false, completed: false };
  }
}
