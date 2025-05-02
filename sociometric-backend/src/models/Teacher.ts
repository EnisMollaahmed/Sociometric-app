import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ITeacher extends Document {
  name: string;
  email: string;
  password: string;
  school: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const TeacherSchema = new mongoose.Schema<ITeacher>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  school: { type: String, required: true }
});

TeacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

TeacherSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<ITeacher>('Teacher', TeacherSchema);