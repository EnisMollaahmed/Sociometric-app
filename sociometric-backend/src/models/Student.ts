import { Schema, model, Document } from 'mongoose';

interface Response {
  questionId: string;
  selectedStudents: string[];
}

interface StudentDocument extends Document {
  name: string;
  hash: string;
  survey: Schema.Types.ObjectId;
  class: string;
  responses: Response[];
  hasCompleted: boolean;
}

const StudentSchema = new Schema<StudentDocument>({
  name: { type: String, required: true },
  hash: { type: String, required: true, unique: true },
  survey: { type: Schema.Types.ObjectId, ref: 'Survey', required: true },
  class: { type: String, required: true },
  responses: [{
    questionId: String,
    selectedStudents: [String]
  }],
  hasCompleted: { type: Boolean, default: false }
});

export default model<StudentDocument>('Student', StudentSchema);