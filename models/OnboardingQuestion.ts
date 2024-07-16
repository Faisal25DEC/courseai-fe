import mongoose, { Schema, Document } from "mongoose";

interface Question {
  question: string;
  type: string;
}

interface OnboardingQuestionDocument extends Document {
  user_id: string;
  questions: Question[];
}

const questionSchema: Schema = new Schema({
  heading: { type: String, required: false },
  question: { type: String, required: true },
  description: { type: String, required: false },
  type: { type: String, required: true },
});

const onboardingQuestionSchema: Schema = new Schema({
  user_id: { type: String, required: true },
  questions: { type: [questionSchema], required: false },
});

export default mongoose.models.OnboardingQuestion ||
  mongoose.model<OnboardingQuestionDocument>(
    "OnboardingQuestion",
    onboardingQuestionSchema
  );
