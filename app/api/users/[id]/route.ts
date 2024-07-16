// app/api/users/[id]/route.ts
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
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
    console.error("Error during user lookup:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  const { id } = params;
  console.log("Received ID for update:", id);

  try {
    const body = await req.json();
    const { org_id, is_verified } = body.verified;

    console.log("Update details:", { org_id, is_verified });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { verified: { org_id, is_verified } } },
      { new: true } // Return the updated document
    );

    console.log("Update operation result:", updatedUser);

    if (!updatedUser) {
      console.log("User not found after update attempt");
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    console.log("User successfully updated:", updatedUser);
    return NextResponse.json(
      { success: true, data: updatedUser },
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
