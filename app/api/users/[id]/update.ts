import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = params;
  console.log("Received ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid user ID" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { org_id, is_verified } = body.verified;

    const updatedUser = await mongoose.connection.db
      .collection("users")
      .findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { verified: { org_id, is_verified } } },
        { returnDocument: "after" }
      );

    if (!updatedUser?.value) {
      console.log("User not found");
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    console.log("User updated:", updatedUser.value);
    return NextResponse.json(
      { success: true, data: updatedUser.value },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during user update:", error); // Log any errors
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 400 }
    );
  }
}
