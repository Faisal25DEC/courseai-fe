import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const users = await clerkClient.users.getUserList({ limit: 100 });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error getting users from Clerk:", error);
    return NextResponse.error();
  }
}
