import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const Course = mongoose.models.courses || mongoose.model('courses', CourseSchema);

export default Course;
