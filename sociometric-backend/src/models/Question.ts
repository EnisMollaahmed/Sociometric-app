import mongoose, { Document } from 'mongoose';

interface IQuestion extends Document {
  content: string;
  type: 'single' | 'multiple';
  category: 'sociometric' | 'preference' | 'behavioral';
}

const QuestionSchema = new mongoose.Schema<IQuestion>({
  content: { type: String, required: true },
  type: { type: String, enum: ['single', 'multiple'], required: true },
  category: { type: String, enum: ['sociometric', 'preference', 'behavioral'], required: true }
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);