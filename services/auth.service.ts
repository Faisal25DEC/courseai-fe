import { toast } from "sonner";

export const sendInvite = async ({
  organizationId,
  emailAddress,
  inviterUserId,
  redirectUrl,
}: {
  organizationId: string;
  emailAddress: string;
  inviterUserId: string;
  redirectUrl: string;
}) => {
  try {
    await fetch(`/api/clerk/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId,
        emailAddress,
        inviterUserId,
        redirectUrl,
      }),
    });
  } catch (error) {
    toast.error("Failed to send invite");
    console.error("Error sending invite:", error);
  }
};
