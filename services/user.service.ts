
export async function getUserById(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}