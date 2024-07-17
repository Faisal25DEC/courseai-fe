import connectToDatabase from "@/lib/mongoose";
import OnboardingQuestion from "@/models/OnboardingQuestion";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { user_id, questions } = await req.json();

    if (!user_id || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Fetch the existing onboarding questions for the user
    let onboardingQuestion = await OnboardingQuestion.findOne({ user_id });

    if (onboardingQuestion) {
      // Append new questions to the existing ones
      onboardingQuestion.questions =
        onboardingQuestion.questions.concat(questions);
    } else {
      // Create a new record if none exists for the user
      onboardingQuestion = new OnboardingQuestion({
        user_id,
        questions,
      });
    }

    await onboardingQuestion.save();

    return NextResponse.json(
      { success: true, data: onboardingQuestion },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json(
      { success: false, error: "Missing user_id" },
      { status: 400 }
    );
  }

  try {
    const questions = await OnboardingQuestion.findOne({ user_id });

    if (!questions) {
      return NextResponse.json(
        { success: false, error: "No questions found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: questions },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  try {
    const { user_id, question_id } = await req.json();

    if (!user_id || !question_id) {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Find the user's onboarding questions
    const onboardingQuestion = await OnboardingQuestion.findOne({ user_id });

    if (!onboardingQuestion) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Remove the question by its _id
    onboardingQuestion.questions = onboardingQuestion.questions.filter(
      (question: any) => question._id.toString() !== question_id
    );

    await onboardingQuestion.save();

    return NextResponse.json(
      { success: true, data: onboardingQuestion },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
