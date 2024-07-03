import { baseUrl } from "@/lib/config";
import axios from "axios";
import { toast } from "sonner";

export const getScorecardQuestions = async (user_id: any) => {
  try {
    const response = await axios.get(`${baseUrl}/scorecards/user/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to create course");
  }
};

export const createScorecardQuestion = async (data: any) => {
  try {
    const response = await axios.post(`${baseUrl}/scorecards`, data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to create course");
  }
};