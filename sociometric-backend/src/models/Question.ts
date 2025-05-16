import mongoose, { Document } from 'mongoose';

interface IQuestion extends Document {
  _id: string; // Change from ObjectId to string
  content: string;
  type: 'single' | 'multiple';
  category: 'sociometric' | 'preference' | 'behavioral';
}

const QuestionSchema = new mongoose.Schema<IQuestion>({
  _id: { type: String, required: true }, // Explicit string ID
  content: { type: String, required: true },
  type: { type: String, enum: ['single', 'multiple'], required: true },
  category: { type: String, enum: ['sociometric', 'preference', 'behavioral'], required: true }
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);