import React from "react";
import { Course } from "../../services/coursesService";
import styles from "./styles.module.scss";
        
const CourseCard = ({ course } : {
  course: Course
}) => {
  return (
    <div className={styles.courseCard}>
      <div className={styles.cardActions}>
        <button className={styles.cardActionBtn}>
          <svg width="24" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
            <path d="M6.3125 13.7558C5.346 13.7559 4.5625 12.9723 4.5625 12.0059V11.9959C4.5625 11.0294 5.346 10.2458 6.3125 10.2458C7.279 10.2458 8.0625 11.0294 8.0625 11.9958V12.0058C8.0625 12.9723 7.279 13.7558 6.3125 13.7558Z" fill="#343C54"/>
            <path d="M18.3125 13.7558C17.346 13.7558 16.5625 12.9723 16.5625 12.0058V11.9958C16.5625 11.0294 17.346 10.2458 18.3125 10.2458C19.279 10.2458 20.0625 11.0294 20.0625 11.9958V12.0058C20.0625 12.9723 19.279 13.7558 18.3125 13.7558Z" fill="#343C54"/>
            <path d="M10.5625 12.0058C10.5625 12.9723 11.346 13.7558 12.3125 13.7558C13.279 13.7558 14.0625 12.9723 14.0625 12.0058V11.9958C14.0625 11.0294 13.279 10.2458 12.3125 10.2458C11.346 10.2458 10.5625 11.0294 10.5625 11.9958V12.0058Z" fill="#343C54"/>
          </svg>
        </button>
        <a className={styles.cardActionBtn} href={`/courses/${course.id}`} target="_blank">
          <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
            <path d="M18.9203 6.0505C18.7834 5.86991 18.5665 5.75324 18.3223 5.75315L9.32695 5.75C8.91265 5.74985 8.57667 6.08545 8.57653 6.49958C8.57638 6.9137 8.91212 7.24954 9.32643 7.24968L16.5172 7.2522L5.79779 17.9716C5.5049 18.2645 5.5049 18.7394 5.79779 19.0323C6.09069 19.3252 6.56556 19.3252 6.85845 19.0323L17.5725 8.31828L17.5748 15.4945C17.5749 15.9086 17.9109 16.2442 18.3252 16.2441C18.7395 16.244 19.0752 15.9081 19.0751 15.494L19.0722 6.56074C19.0853 6.38214 19.0346 6.19976 18.9203 6.0505Z" fill="#343C54"/>
          </svg>
        </a>        
      </div>

      <div className={styles.cardContent}>
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

      <div className={styles.cardTags}>
        {course.tags.map((tag: string, index: number) => (
          <span key={index} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CourseCard;