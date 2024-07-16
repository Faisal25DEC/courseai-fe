import connectToDatabase from "@/lib/mongoose";
import OnboardingAnswer from "@/models/OnboardingAnswer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { user_id, answers } = await req.json();

    if (!user_id || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    const newOnboardingAnswer = new OnboardingAnswer({
      user_id,
      answers,
    });

    await newOnboardingAnswer.save();

    return NextResponse.json(
      { success: true, data: newOnboardingAnswer },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  await connectToDatabase();

  const { user_id } = params;

  try {
    const answers = await OnboardingAnswer.findOne({ user_id });

    if (!answers) {
      return NextResponse.json(
        { success: false, error: "No answers found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: answers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
