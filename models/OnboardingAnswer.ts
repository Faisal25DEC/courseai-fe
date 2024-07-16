import mongoose, { Schema, Document } from 'mongoose';

interface Answer {
  question_id: string;
  answer: any;
}

interface OnboardingAnswerDocument extends Document {
  user_id: string;
  answers: Answer[];
}

const answerSchema: Schema = new Schema({
  question_id: { type: String, required: true },
  answer: { type: Schema.Types.Mixed, required: true },
});

const onboardingAnswerSchema: Schema = new Schema({
  user_id: { type: String, required: true },
  answers: { type: [answerSchema], required: true },
});

export default mongoose.models.OnboardingAnswer ||
  mongoose.model<OnboardingAnswerDocument>('OnboardingAnswer', onboardingAnswerSchema);
