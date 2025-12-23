"use client";
import { useEffect, useState } from "react";
// components
import CourseCard from "../../components/CourseCard";
// api imports
import { useUserContext } from "../../contexts/UserContext";
import { AuthoredCourse, EnrolledCourse, usersService, UserStats } from "../../services/usersService";
// style imports
import styles from "./dashboard.module.scss";

const Dashbaord = () => {
  const { selectedUserId } = useUserContext();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [authoredCourses, setAuthoredCourses] = useState<AuthoredCourse[] | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[] | null>(null);

  useEffect(() => {
    if (selectedUserId) {
      usersService.getUserStats(selectedUserId)
      .then((data) => {
        setUserStats(data);
        setAuthoredCourses(data.authoredCourses);
        setEnrolledCourses(data.enrolledCourses);
      });
    }
  }, [selectedUserId]);

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div className={styles.welcomeText}>
          <h1>Welcome back, {userStats ? userStats.name : "Learner"}! 👋</h1>
          <p>Keep learning and win some cool badges!</p>
        </div>

        <div className={styles.userStats}>
          {authoredCourses?.length
          ? (
            <div className={styles.userText}>
              <h2>{authoredCourses.length}</h2>
              <p>Authored Courses</p>
            </div>
          ) : null}
          {enrolledCourses?.length
          ? (
            <>
              <div className={styles.userText}>
                <h2>
                  {enrolledCourses.length.toLocaleString("en-US", { minimumIntegerDigits: 2 })}
                </h2>
                <p>Enrolled Courses</p>
              </div>

              <div className={styles.userText}>
                <h2>{userStats?.averageCompletionRate.toFixed(2) || "0.00"}</h2>
                <p>Avg Completion Rate</p>
              </div>
            </>
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

      {enrolledCourses && enrolledCourses.length > 0
      ? (
        <div className={styles.userCourses}>
          <h3>Enrolled Courses</h3>
          <div className={styles.courses}>
            {enrolledCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default Dashbaord