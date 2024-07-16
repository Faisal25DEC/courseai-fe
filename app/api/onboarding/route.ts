import connectToDatabase from '@/lib/mongoose';
import OnboardingQuestion from '@/models/OnboardingQuestion';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { user_id, questions } = await req.json();

    if (!user_id || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ success: false, error: 'Invalid input data' }, { status: 400 });
    }

    const newOnboardingQuestion = new OnboardingQuestion({
      user_id,
      questions,
    });

    await newOnboardingQuestion.save();

    return NextResponse.json({ success: true, data: newOnboardingQuestion }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');

  if (!user_id) {
    return NextResponse.json({ success: false, error: 'Missing user_id' }, { status: 400 });
  }

  try {
    const questions = await OnboardingQuestion.findOne({ user_id });

    if (!questions) {
      return NextResponse.json({ success: false, error: 'No questions found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: questions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
