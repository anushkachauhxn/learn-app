"use client";
import { useEffect, useState, use } from "react";
import Image from "next/image";
// components
import CourseCard from "../../../components/CourseCard";
import CourseTags from "../../../components/CourseTags";
import Icons from "../../../components/Icons";
// api imports
import { useUserContext } from "../../../contexts/UserContext";
import { Course, CourseDetail, Lesson, coursesService } from "../../../services/coursesService";
// constants
import { COURSE_FEATURES } from "../../../constants";
// style imports
import styles from "./styles.module.scss";

const CoursePage = ({ params }: CoursePageProps) => {
  const { id: courseId } = use(params);
  const { selectedUserId } = useUserContext();
  const [courseData, setCourseData] = useState<CourseDetail | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [similarCourses, setSimilarCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (selectedUserId && courseId) {
      coursesService.getCourseDetails(+courseId, selectedUserId)
      .then((data) => {
        setCourseData(data);
        setLessons(data.lessons);
      })
      .catch((error) => {
        console.log(error);
      });

      coursesService.getSimilarCourses(+courseId)
      .then((data) => {
        setSimilarCourses(data);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [selectedUserId, courseId]);

  const handleChangeEnrollment = () => {
    if (selectedUserId) {
      if (!courseData?.enrolled) {
        coursesService.enrollCourse(+courseId, selectedUserId);
      } else {
        coursesService.unenrollCourse(+courseId, selectedUserId);
      }
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.courseContent}>
        <div className={styles.card}>
          <h1>{courseData?.title}</h1>
          <p>{courseData?.description}</p>
          <CourseTags tags={courseData?.tags} />
          <a href={`/users/${courseData?.author?.id}`}>
            <div className={styles.authorInfo}>
              <Image
                src="/user-placeholder.jpg"
                alt=""
                width={24}
                height={24}
              />
              <h4>{courseData?.author?.name}</h4>
            </div>
          </a>
        </div>

        {lessons && lessons.length > 0 ? (
          <div className={styles.card}>
            <h2>Course Lessons</h2>
            <ul className={styles.lessonsList}>
              {lessons.map((lesson, index) => (
                <a key={lesson.id} href={`/lessons/${lesson.id}`}>
                  <li>
                    <h4>
                      {index + 1}. {lesson.title}
                      {lesson.completed
                        ? (
                          <div className={styles.completed}>
                            <Icons.CheckSquare />
                            <h4>Completed</h4>
                          </div>
                        ) : null
                      }
                    </h4>
                    <h6>{lesson.description}</h6>
                  </li>
                </a>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className={styles.courseDetails}>
        <div className={styles.card}>
          <img src={courseData?.previewImageUrl} alt="" />
          <button
            className={styles.ctaButton}
            onClick={handleChangeEnrollment}
          >
            {courseData?.enrolled ? <Icons.PlugSolid /> : <Icons.BoltSolid />}
            {courseData?.enrolled ? "Unenroll" : "Enroll Now"}
          </button>
          <hr />
          <h4>This course includes</h4>
          <ul className={styles.featuresList}>
            {COURSE_FEATURES.map((feature, index) => {
              const { Icon, text } = feature;
              return (
                <li key={index}>
                  <Icon />
                  <h5>{text === "Lessons" ? lessons.length : ""} {text}</h5>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className={styles.similarCourses}>
        <h2>Similar Courses</h2>
        <div className={styles.coursesList}>
          {similarCourses.map((course) => (
            <a key={course.id} href={`/courses/${course.id}`}>
              <CourseCard course={course} />
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default CoursePage