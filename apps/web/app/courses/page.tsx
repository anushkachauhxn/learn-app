import CourseCard from "../../components/CourseCard";
import { coursesService } from "../../services/coursesService";
import styles from "./courses.module.scss";

export default async function Courses() {
  const courses = await coursesService.getAllCourses();

  return (
    <main className={styles.container}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </main>
  );
}