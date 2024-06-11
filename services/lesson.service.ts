import { baseUrl } from "@/lib/config";
import axios from "axios";

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
