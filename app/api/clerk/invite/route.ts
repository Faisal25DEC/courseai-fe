import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { organizationId, emailAddress, inviterUserId, redirectUrl } =
      await req.json();
    await clerkClient.organizations.createOrganizationInvitation({
      organizationId,
      emailAddress,
      inviterUserId,
      role: "org:member",
      redirectUrl,
    });

    return NextResponse.json({ message: "Invitation sent!" });
  } catch (error) {
    console.error("Error getting users from Clerk:", error);
    return NextResponse.error();
  }
}
