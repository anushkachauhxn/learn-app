import React from "react";
// component imports
import CourseTags from "../CourseTags";
import Icons from "../Icons";
// service imports
import { Course } from "../../services/coursesService";
import { AuthoredCourse, EnrolledCourse } from "../../services/usersService";
// style imports
import styles from "./styles.module.scss";
        
const CourseCard = ({ course } : {
  course: Course | AuthoredCourse | EnrolledCourse
}) => {
  return (
    <div className={styles.courseCard}>
      <div className={styles.cardActions}>
        <button className={styles.cardActionBtn}>
          <Icons.Menu />
        </button>
        <a className={styles.cardActionBtn} href={`/courses/${course.id}`} target="_blank">
          <Icons.ArrowAngular height={20} />
        </a>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardImage}>
          <img src={course.previewImageUrl} alt="" />
        </div>

        <div className={styles.cardText}>
          <h2>{course.title}</h2>
          <h4>{course.author.name}</h4>
        </div>

        <div className={styles.cardStats}>
          <div className={styles.cardText}>
            <h3>20</h3>
            <p>Hours</p>
          </div>
          <div className={styles.cardText}>
            <h3>15</h3>
            <p>Lessons</p>
          </div>
        </div>
      </div>

      <CourseTags tags={course.tags} />

      {"completionPercentage" in course && (
        <div className={styles.cardProgress}>
          <div className={styles.progressBar}>
            {Array.from({ length: 50 }, (_, index) => {
              const isCompleted = (index + 1) / 50 * 100 <= course.completionPercentage;
              return (
                <span
                  key={index}
                  className={`${styles.progressItem} ${isCompleted? styles.completed : ""}`}
                />
              )
            })}
          </div>

          <div className={styles.progressInfo}>
            <span>
              {course.completedLessons} / {course.totalLessons}
              {course.completionPercentage > 0
                ? course.completionPercentage === 100
                  ? " Completed"
                  : " In Progress"
                : " Not Started"
              }
            </span>
            <span>{Math.round(course.completionPercentage)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;