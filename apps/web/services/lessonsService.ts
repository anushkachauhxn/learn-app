import { apiCall } from "../lib/api";

// TypeScript interfaces for Lesson data
export interface Lesson {
  id: number;
  title: string;
  description: string;
  previewImageUrl?: string;
  videoUrl?: string;
}

export interface LessonDetail extends Lesson {
  courseId: number;
  completed?: boolean;
}

export const lessonsService = {
  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    return await apiCall(`/lessons/all/${courseId}`);
  },

  async getLessonDetails(id: number): Promise<LessonDetail> {
    return await apiCall(`/lessons/${id}`);
  },

  async markLessonComplete(id: number): Promise<Lesson> {
    return await apiCall(`/lessons/complete/${id}`, {
      method: "POST",
    });
  },
};