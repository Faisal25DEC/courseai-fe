import { baseUrl } from "@/lib/config";
import axios from "axios";
import { toast } from "sonner";

export const updateLesson = async (
  courseId: string,
  lessonId: string,
  data: any
) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/courses/${courseId}/lessons/${lessonId}`,
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
export const updateCourse = async (courseId: string, data: any) => {
  try {
    const response = await axios.patch(`${baseUrl}/courses/${courseId}`, data);

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteLesson = async (courseId: string, lessonId: string) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/courses/${courseId}/lessons/${lessonId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
export const getCourse = async (courseId: string) => {
  try {
    const response = await axios.get(`${baseUrl}/courses/${courseId}`);

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const updateLessonForUser = async ({
  user_id,
  course_id,
  lesson_id,
  data,
}: {
  user_id: any;
  course_id: string;
  lesson_id: any;
  data: any;
}) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/users/${user_id}/analytics/${course_id}/lessons/${lesson_id}`,
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const approveLessonRequest = async (data: {
  lesson_id: number;
  course_id: string;
  user_id: string;
  status: string;
}) => {
  try {
    const response = await axios.post(`${baseUrl}/lesson-approvals`, data);

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getUserAnalytics = async (userId: string, courseId: string) => {
  try {
    const response = await axios.get(
      `${baseUrl}/users/${userId}/courses/${courseId}/analytics`
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
export const getCourseAnalytics = async (courseId: string) => {
  try {
    const response = await axios.get(
      `${baseUrl}/courses/${courseId}/analytics`
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getEnrolledUsers = async (
  courseId: string,
  setEnrolledUsers: any
) => {
  try {
    const response = await axios.get(`${baseUrl}/courses/${courseId}/users`);

    setEnrolledUsers(response.data);
  } catch (error) {
    console.error("Error:", error);
    setEnrolledUsers([]);
  }
};

export const enrollUser = async (courseId: string, userId: string) => {
  try {
    const response = await axios.post(
      `${baseUrl}/courses/${courseId}/enrollment`,
      {
        user_id: userId,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
export const expelUser = async (courseId: string, userId: string) => {
  try {
    const response = await axios.patch(`${baseUrl}/courses/${courseId}/expel`, {
      user_id: userId,
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getEnrolledUsersInACourse = async (courseId: string) => {
  try {
    const usersRes = await axios.get("/api/get-users-from-clerk");
    const res = await axios.get(`${baseUrl}/courses/${courseId}/users`);
    const users = usersRes.data.data;
    const enrolledUsersIds = res.data;

    const enrolledUsersArray = users.filter((user: any) =>
      enrolledUsersIds.some((item: any) => item.user_id === user.id)
    );
    const enrolledUsersWithDate = enrolledUsersArray.map((user: any) => {
      return {
        ...user,
        enrolled_at: enrolledUsersIds.find(
          (item: any) => item.user_id === user.id
        ).enrolled_at,
      };
    });
    return enrolledUsersWithDate;
  } catch (error) {
    toast.error("Failed to fetch enrolled users");
    console.error(error);
  }
};
