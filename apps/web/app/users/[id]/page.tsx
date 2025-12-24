"use client";
import { useEffect, useState, use } from "react";
// components
import CourseCard from "../../../components/CourseCard";
// api imports
import { AuthoredCourse, usersService, UserStats } from "../../../services/usersService";
// style imports
import styles from "../../dashboard/dashboard.module.scss";

const UserStatsPage = ({ params }: UserStatsPageProps) => {
  const { id: userId } = use(params);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [authoredCourses, setAuthoredCourses] = useState<AuthoredCourse[] | null>(null);
  
  useEffect(() => {
    if (userId) {
      usersService.getUserStats(+userId)
      .then((data) => {
        setUserStats(data);
        setAuthoredCourses(data.authoredCourses);
      });
    }
  }, [userId]);

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div className={styles.welcomeText}>
          <h1>This is {userStats ? userStats.name : ""}! ⚡️</h1>
          <p>Look at their courses!</p>
        </div>

        <div className={styles.userStats}>
          {authoredCourses?.length
          ? (
            <div className={styles.userText}>
              <h2>{authoredCourses.length.toLocaleString("en-US", { minimumIntegerDigits: 2 })}</h2>
              <p>Authored Courses</p>
            </div>
          ) : null}
        </div>
      </div>

      {authoredCourses && authoredCourses.length > 0
      ? (
        <div className={styles.userCourses}>
          <h3>Authored Courses</h3>
          <div className={styles.courses}>
            {authoredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      ) : null}
    </main>
  );
}

interface UserStatsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default UserStatsPage