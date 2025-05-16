import mongoose, { Document } from 'mongoose';

interface ISurvey extends Document {
  title: string;
  description: string;
  teacher: mongoose.Types.ObjectId;
  class: string;
  questions: mongoose.Types.ObjectId[];
  students: mongoose.Types.ObjectId[];
  status: 'draft' | 'active' | 'completed';
  createdAt: Date;
  expiresAt: Date;
}

const SurveySchema = new mongoose.Schema<ISurvey>({
  title: { type: String, required: true },
  description: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  class: { type: String, required: true },
  questions: [{
    type: String, // or mongoose.Schema.Types.ObjectId if using ObjectIds
    ref: 'Question',
    required: true
  }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  status: { type: String, enum: ['draft', 'active', 'completed'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

export default mongoose.model<ISurvey>('Survey', SurveySchema);