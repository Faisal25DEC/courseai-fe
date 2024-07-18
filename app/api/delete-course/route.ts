import connectToDatabase from '@/lib/mongoose';
import Course from '@/models/Courses';
import { NextResponse } from 'next/server';


export async function POST(req:Request) {
  await connectToDatabase();

  try {
    const { course_id } = await req.json();

    if (!course_id) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const deletedCourse = await Course.findByIdAndDelete(course_id);

    if (!deletedCourse) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: deletedCourse },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error },
      { status: 500 }
    );
  }
}
