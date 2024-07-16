export const fetchOnboardingQuestions = async (user_id: string) => {
  try {
    const response = await fetch(`/api/onboarding?user_id=${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to fetch onboarding questions"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching onboarding questions:", error);
    throw error;
  }
};

export async function fetchOnboardingAnswers(user_id: string) {
  try {
    const response = await fetch(`/api/save-onboarding-answers/${user_id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch onboarding answers");
    }

    return data;
  } catch (error) {
    console.error("Error fetching onboarding questions:", error);
    throw error;
  }
}
