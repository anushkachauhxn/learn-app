import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.prisma.user.findMany({
      where: { deleted: false },
      select: { id: true, name: true, email: true }
    });
  }

  async findOne(id: number) {
    const user = await this.db.prisma.user.findUnique({
      where: { id, deleted: false },
      select: { id: true, name: true, email: true }
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findUserStats(id: number) {
    const user = await this.db.prisma.user.findUnique({
      where: { id, deleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        enrollments: {
          where: { deleted: false },
          select: { courseId: true }
        },
        authoredCourses: {
          where: { deleted: false },
          select: {
            id: true,
            title: true,
            description: true,
            previewImageUrl: true,
            author: {
              select: { id: true, name: true, email: true }
            },
            tags: {
              select: { name: true }
            }
          }
        }
      }
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // get authored courses
    user.authoredCourses = user.authoredCourses.map((course: any) => ({
      ...course,
      tags: course.tags.map((tag: any) => tag.name)
    }));

    // get enrolled courses and completion stats
    const enrolledCourseIds = user.enrollments.map((enrollment: any) => enrollment.courseId);
    const enrollmentStats = await this.resolveUserEnrollmentStats(id, enrolledCourseIds);
    return {
      name: user.name,
      email: user.email,
      authoredCourses: user.authoredCourses,
      enrolledCourses: enrollmentStats.enrolledCourses,
      averageCompletionRate: enrollmentStats.averageCompletionRate
    };
  }

  private async resolveUserEnrollmentStats(userId: number , courseIds: number[]): Promise<any> {
    const courses = await this.db.prisma.course.findMany({
      where: {
        id: { in: courseIds },
        deleted: false
      },
      select: {
        id: true,
        title: true,
        description: true,
        previewImageUrl: true,
        author: {
          select: { id: true, name: true, email: true }
        },
        tags: {
          select: { name: true }
        },
        lessons: {
          where: { deleted: false },
          select: { id: true }
        },
        enrollments: {
          where: { userId, deleted: false },
          select: {
            completed: {
              select: { id: true }
            }
          }
        }
      }
    });

    // calculate completion stats
    let enrolledCourses = [];
    let averageCompletionRate = 0;
    if (courses.length > 0) {
      enrolledCourses = courses.map((course: any) => {
        const completedLessons = course.enrollments.length > 0 ? course.enrollments[0].completed.length : 0;
        const totalLessons = course.lessons.length;
        const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
        averageCompletionRate += completionPercentage;
        return {
          id: course.id,
          title: course.title,
          description: course.description,
          previewImageUrl: course.previewImageUrl,
          author: course.author,
          tags: course.tags.map((tag: any) => tag.name),
          completedLessons: completedLessons,
          totalLessons: totalLessons,
          completionPercentage: completionPercentage
        };
      });
    }
    if (enrolledCourses.length > 0) {
      averageCompletionRate = averageCompletionRate / enrolledCourses.length;
    }

    return {
      enrolledCourses,
      averageCompletionRate
    };
  }
}
