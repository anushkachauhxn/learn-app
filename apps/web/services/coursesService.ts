import { apiCall } from "../lib/api";

// TypeScript interfaces for Course data
export interface Course {
  id: number;
  title: string;
  description: string;
  previewImageUrl?: string;
  author: {
    name: string;
    email: string;
  };
  tags: string[];
}

export interface CourseDetail extends Course {
  lessons: Lesson[];
  completionPercentage: number;
  enrolled: boolean;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  previewImageUrl?: string;
  videoUrl?: string;
  completed: boolean;
}

export const coursesService = {
  async getAllCourses(): Promise<Course[]> {
    return await apiCall("/courses");
  },

  async getCourseDetails(id: number, userId: number): Promise<CourseDetail> {
    return await apiCall(`/courses/${id}?userId=${userId}`);
  },

  async getSimilarCourses(id: number): Promise<Course[]> {
    return await apiCall(`/courses/similar/${id}`);
  },

  async enrollCourse(id: number, userId: number): Promise<CourseDetail> {
    return await apiCall(`/courses/enroll/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
  },

  async unenrollCourse(id: number, userId: number): Promise<CourseDetail> {
    return await apiCall(`/courses/unenroll/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
  },
};