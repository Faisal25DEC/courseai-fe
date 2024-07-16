export async function getUserById(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export const updateUserVerifiedStatus = async (
  userId: string,
  orgId: string,
  isVerified: boolean
) => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        verified: {
          org_id: orgId,
          is_verified: isVerified,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update user verified status");
    }

    return data;
  } catch (error) {
    console.error("Error updating user verified status:", error);
    throw error;
  }
};
