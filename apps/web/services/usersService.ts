import { apiCall } from "../lib/api";

// TypeScript interfaces for User data
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserStats {
  id: number;
  name: string;
  email: string;
  authoredCourses: AuthoredCourse[];
  enrolledCourses: EnrolledCourse[];
  averageCompletionRate: number;
}

export interface AuthoredCourse {
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

export interface EnrolledCourse {
  id: number;
  title: string;
  description: string;
  previewImageUrl?: string;
  author: {
    name: string;
    email: string;
  },
  tags: string[];
  completedLessons: number;
  totalLessons: number;
  completionPercentage: number;
}

export const usersService = {
  async getAllUsers(): Promise<User[]> {
    return await apiCall("/users");
  },
  
  async getUser(id: number): Promise<User> {
    return await apiCall(`/users/${id}`);
  },
  
  async getUserStats(id: number): Promise<UserStats> {
    return await apiCall(`/users/stats/${id}`);
  },
};
