"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// components
import Icons from "../../../components/Icons";
// api imports
import { useUserContext } from "../../../contexts/UserContext";
import { LessonDetail, lessonsService } from "../../../services/lessonsService";
import { CourseDetail, coursesService } from "../../../services/coursesService";
// style imports
import styles from "./styles.module.scss";

const LessonPage = ({ params }: LessonPageProps) => {
  const router = useRouter();
  const { id: lessonId } = use(params);
  const { selectedUserId } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [lessonData, setLessonData] = useState<LessonDetail | null>(null);
  const [courseData, setCourseData] = useState<CourseDetail | null>(null);

  useEffect(() => {
    loadPageData();
  }, [selectedUserId, lessonId]);

  const loadPageData = () => {
    if (selectedUserId && lessonId) {
      setLoading(true);
      lessonsService.getLessonDetails(+lessonId, selectedUserId)
      .then((lessonData) => {
        setLessonData(lessonData);
        return coursesService.getCourseDetails(lessonData.courseId, selectedUserId);
      })
      .then((courseData) => {
        setCourseData(courseData);
      })
      .catch((error) => {
        console.error("Failed to load lesson data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }

  const handleCtaClick = () => {
    if (!lessonData?.enrolled) {
      router.push(`/courses/${lessonData?.courseId}`);
    }
    else if (selectedUserId) {
      setActionLoading(true);
      lessonsService.markLessonComplete(+lessonId, selectedUserId)
      .then(() => {
        // Reload page data after marking complete
        return loadPageData();
      })
      .catch((error) => {
        console.error("Failed to mark lesson complete:", error);
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
      <div className={styles.lessonContent}>
        <Link href={`/courses/${lessonData?.courseId}`}>
          <h6>{courseData?.title}</h6>
        </Link>
        <h1>{lessonData?.order}. {lessonData?.title}</h1>
        <div className={styles.videoWrapper}>
          <iframe
            width="100%"
            height="400"
            frameBorder="0"
            src={lessonData?.videoUrl}
            title={lessonData?.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <p>{lessonData?.description}</p>
      </div>

      <div className={styles.lessonDetails}>
        <div className={styles.card}>
          <img src={lessonData?.previewImageUrl} alt={lessonData?.title} />

          {lessonData?.enrolled && lessonData?.completed
            ? (
              <h5><Icons.CheckSquare />Completed</h5>
            ) : (
              <button className={styles.ctaBtn} onClick={handleCtaClick} disabled={actionLoading}>
                {actionLoading ? (
                  <>
                    <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                    Loading...
                  </>
                ) : (
                  <>
                    {lessonData?.enrolled ? <Icons.CheckSquare /> : <Icons.BoltSolid />}
                    {lessonData?.enrolled ? "Mark as Complete" : "Go to Course"}
                  </>
                )}
              </button>
            )
          }
          <hr />
          {courseData && courseData.lessons.length > 0 && (
            <>
              <h2>Course Lessons</h2>
              <ul className={styles.lessonsList}>
                {courseData.lessons.map((lesson, index) => {
                  const isCurrent = lesson.id === +lessonId;
                  return (
                    <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                      <li className={isCurrent ? styles.current : ""}>
                        <h4>
                          {index + 1}. {lesson.title}
                          <div className={styles.status}>
                            {isCurrent ? <Icons.BoltSolid /> : null}
                            {lesson.completed ? <Icons.CheckSquare /> : null}
                            {lesson.completed ? "Completed" : isCurrent ? "Current" : null}
                          </div>
                        </h4>
                        <h6>{lesson.description}</h6>
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default LessonPage