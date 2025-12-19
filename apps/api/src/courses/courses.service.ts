import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CoursesService {
  constructor(private db: DatabaseService) {}

  async create(data: CreateCourseDto) {
    const createData = await this.resolveAuthorAndTags(data);

    return this.db.prisma.course.create({
      data: createData
    });
  }

  async update(id: number, data: UpdateCourseDto) {
    const updateData = await this.resolveAuthorAndTags(data);

    return this.db.prisma.course.update({
      where: { id, deleted: false },
      data: updateData
    });
  }

  async delete(id: number) {
    return this.db.prisma.course.update({
      where: { id, deleted: false },
      data: { deleted: true }
    });
  }

  async findAll() {
    const courses = await this.db.prisma.course.findMany({
      where: { deleted: false },
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

  async findSimilar(id: number) {
    const course = await this.db.prisma.course.findUnique({
      where: { id, deleted: false },
      select: {
        tags: {
          select: { id: true }
        }
      }
    });
    if (!course) {
      throw new NotFoundException("Course not found");
    }

    const courseTags = course.tags.map((tag: any) => tag.id);
    const similarCourses = await this.db.prisma.course.findMany({
      where: {
        id: { not: id },
        deleted: false,
        tags: { some: { id: { in: courseTags } } }
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

    return similarCourses.map((course: any) => ({
      ...course,
      tags: course.tags.map((tag: any) => tag.name)
    }));
  }

  private async resolveAuthorAndTags(data: any): Promise<any> {
    let resolvedData = { ...data };

    // resolve author if provided
    if (data.authorEmail) {
      const author = await this.db.prisma.user.findUnique({
        where: { email: data.authorEmail }
      });
      if (!author) {
        throw new NotFoundException("Author not found");
      }
      resolvedData.authorId = author.id;
      delete resolvedData.authorEmail;
    }

    // resolve tags if provided
    if (data.tags) {
      const tags = await this.db.prisma.tag.findMany({
        where: {
          name: { in: data.tags }
        },
        select: { id: true }
      });
      resolvedData.tags = { connect: tags };
    }

    return resolvedData;
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
