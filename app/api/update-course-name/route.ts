import connectToDatabase from '@/lib/mongoose';
import Course from '@/models/Courses';
import { NextResponse } from 'next/server';


export async function POST(req:Request) {
  await connectToDatabase();

  try {
    const { course_id, new_title } = await req.json();

    if (!course_id || !new_title) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      );
    }

    const course = await Course.findById(course_id);

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    course.title = new_title;
    await course.save();

    return NextResponse.json(
      { success: true, data: course },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error },
      { status: 500 }
    );
  }
}
