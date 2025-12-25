"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
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
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [courseData, setCourseData] = useState<CourseDetail | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [similarCourses, setSimilarCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadPageData();
  }, [selectedUserId, courseId]);

  const loadPageData = () => {
    if (selectedUserId && courseId) {
      setLoading(true);
      Promise.all([
        coursesService.getCourseDetails(+courseId, selectedUserId),
        coursesService.getSimilarCourses(+courseId)
      ])
      .then(([courseData, similarData]) => {
        setCourseData(courseData);
        setLessons(courseData.lessons);
        setSimilarCourses(similarData);
      })
      .catch((error) => {
        console.error("Failed to load course data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }

  const handleChangeEnrollment = () => {
    if (selectedUserId) {
      setActionLoading(true);
      const enrollmentAction = courseData?.enrolled
        ? coursesService.unenrollCourse(+courseId, selectedUserId)
        : coursesService.enrollCourse(+courseId, selectedUserId);

      enrollmentAction
      .then(() => {
        loadPageData(); // Reload page data after enrollment change
      })
      .catch((error) => {
        console.error("Failed to change enrollment:", error);
      })
      .finally(() => {
        setActionLoading(false);
      });
    }
  }

  if (loading) {
    return (
      <main className={styles.container}>
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.courseContent}>
        <div className={styles.card}>
          <h1>{courseData?.title}</h1>
          <p>{courseData?.description}</p>
          <CourseTags tags={courseData?.tags} />
          <Link href={`/users/${courseData?.author?.id}`}>
            <div className={styles.authorInfo}>
              <Image
                src="/user-placeholder.jpg"
                alt=""
                width={24}
                height={24}
              />
              <h4>{courseData?.author?.name}</h4>
            </div>
          </Link>
        </div>

        {lessons && lessons.length > 0 ? (
          <div className={styles.card}>
            <h2>Course Lessons</h2>
            <ul className={styles.lessonsList}>
              {lessons.map((lesson, index) => (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
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
                </Link>
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
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                Loading...
              </>
            ) : (
              <>
                {courseData?.enrolled ? <Icons.PlugSolid /> : <Icons.BoltSolid />}
                {courseData?.enrolled ? "Unenroll" : "Enroll Now"}
              </>
            )}
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
            <CourseCard key={course.id} course={course} />
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