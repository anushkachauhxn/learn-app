import { PrismaClient } from "../generated/client";
import { courseData, tagsData, userData } from "./seedData";

const prisma = new PrismaClient();


async function main() {
  console.log("🌱 Starting seed...");

  // Check if database is already seeded
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log("✅ Database already seeded, skipping...");
    return;
  }

  // Create Users
  await prisma.user.createMany({ data: userData });
  console.log("✅ Users created");

  // Create Tags
  await prisma.tag.createMany({ data: tagsData });
  console.log("✅ Tags created");

  // Create Courses
  for (const course of courseData) {
    let author = await prisma.user.findUnique({
      where: {
        email: course.author,
      },
    });
    let tags = await prisma.tag.findMany({
      where: {
        name: {
          in: course.tags,
        },
      },
    });
    
    if (author) {
      const dbCourse = await prisma.course.create({
        data: {
          title: course.title,
          description: course.description,
          previewImageUrl: course.previewImageUrl,
          authorId: author.id,
          tags: {
            connect: tags,
          },
        },
      });

      console.log("✅ Course created:", dbCourse.title);

      if (course.lessons) {
        let lessonData = course.lessons.map((lesson, index) => {
          return {
            ...lesson,
            order: index + 1,
            courseId: dbCourse.id
          };
        });

        await prisma.lesson.createMany({
          data: lessonData,
        });
        console.log("✅ Lessons created for course:", dbCourse.title);
      }

      if (course.students) {
        for (const studentEmail of course.students) {
          let student = await prisma.user.findUnique({ where: { email: studentEmail } });
          if (student) {
            await prisma.userCourse.create({
              data: {
                userId: student.id,
                courseId: dbCourse.id,
              },
            });
          }
        }
        console.log("✅ Enrollments created for course:", dbCourse.title);
      }
    } else {
      console.error("❌ Author not found for course:", course.title);
    }
  }
  console.log("✅ Courses and Lessons created");

  // Mark random lessons as completed for each enrollment
  const allEnrollments = await prisma.userCourse.findMany({
    where: {
      deleted: false
    }
  });

  for (const enrollment of allEnrollments) {
    let lessons = await prisma.lesson.findMany({
      where: {
        courseId: enrollment.courseId,
        deleted: false
      }
    });

    if (lessons.length > 0) {
      const maxCompletions = Math.min(3, lessons.length); 
      const completionsCount = Math.floor(Math.random() * (maxCompletions + 1)); // 0 to maxCompletions

      if (completionsCount > 0) {
        let completedLessons = lessons.filter((lesson: any) => lesson.order <= completionsCount).map((lesson: any) => ({ id: lesson.id }));

        await prisma.userCourse.update({
          where: { id: enrollment.id },
          data: {
            completed: {
              connect: completedLessons
            }
          }
        });
      }
    }
  }
  console.log("✅ Lesson completions created");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });