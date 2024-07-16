// app/api/users/[id]/route.ts
import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mongoose = await connectToDatabase();

  const { id } = params;
  console.log("Received ID:", id);

  try {
    const user = await mongoose.connection.db
      .collection("users")
      .findOne({ _id: id });
    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    console.log("User found:", user);
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error("Error during user lookup:", error); // Log any errors
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 400 }
    );
  }
}
