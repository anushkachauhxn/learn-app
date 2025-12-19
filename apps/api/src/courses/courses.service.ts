import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CoursesService {
  constructor(private db: DatabaseService) {}

  async create(createCourseDto: CreateCourseDto) {
    return this.db.prisma.course.create({ data: createCourseDto });
  }

  async update(id: number, data: UpdateCourseDto) {
    return this.db.prisma.course.update({
      where: { id },
      data: data
    });
  }

  async delete(id: number) {
    return this.db.prisma.course.update({
      where: { id },
      data: { deleted: true }
    });
  }

  async findAll() {
    const courses = await this.db.prisma.course.findMany({
      where: {
        deleted: false
      },
      select: {
        id: true,
        title: true,
        description: true,
        previewImageUrl: true,
        author: {
          select: { name: true, email: true }
        },
        tags: {
          select: { name: true }
        }
      }
    });
    if (!courses || courses.length === 0) {
      throw new NotFoundException("Courses not found");
    }
    return courses.map((course: any) => ({
      ...course,
      tags: course.tags.map((tag: any) => tag.name)
    }));
  }

  async findOne(id: number) {
    const currentUserId = 4;
    const course = await this.db.prisma.course.findUnique({
      where: { id, deleted: false },
      select: {
        id: true,
        title: true,
        description: true,
        previewImageUrl: true,
        author: {
          select: { name: true, email: true }
        },
        tags: {
          select: { name: true }
        },
        lessons: {
          where: { deleted: false },
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            description: true,
            previewImageUrl: true,
            videoUrl: true
          }
        },
        enrollments: {
          where: { userId: currentUserId, deleted: false },
          select: {
            completed: {
              select: { id: true }
            }
          }
        }
      }
    });
    if (!course) {
      throw new NotFoundException("Course not found");
    }
    return {
      ...course,
      tags: course.tags.map((tag: any) => tag.name),
      lessons: this.getCourseLessons(course),
      completionPercentage: this.calculateCourseCompletion(course),
      enrolled: course.enrollments.length > 0,
      enrollments: undefined,
    };
  }

  private getCompletedCourseLessons(course: any) : Set<any> {
    let completedLessons = [];
    if (course.enrollments.length > 0 && course.lessons.length > 0) {
      course.enrollments.forEach((enrollment: any) => {
        let ids = enrollment.completed.map((completedLesson: any) => completedLesson.id);
        completedLessons = completedLessons.concat(ids);
      });
    }
    return new Set(completedLessons);
  }

  private getCourseLessons(course: any) : Array<any> {
    const completedLessons = this.getCompletedCourseLessons(course);
    return course.lessons.map((lesson: any) => ({
      ...lesson,
      completed: completedLessons.has(lesson.id)
    }));
  }

  private calculateCourseCompletion(course: any) : number {
    const completedLessons = this.getCompletedCourseLessons(course);
    return course.lessons.length > 0 ? (completedLessons.size / course.lessons.length) * 100 : 0;
  }
}
