import axios from "axios";
import { toast } from "sonner";

interface GptScorecardRequest {
  scorecardQuestions: string[];
  conversation: string;
}

interface GptScorecardResponse {
  answers: boolean[];
}

export const evaluateScorecard = async (
  data: GptScorecardRequest
): Promise<GptScorecardResponse | undefined> => {
  try {
    const response = await axios.post<GptScorecardResponse>(
      "/api/gpt-scorecard",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to evaluate scorecard");
  }
};
