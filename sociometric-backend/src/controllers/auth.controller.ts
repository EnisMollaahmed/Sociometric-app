import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Teacher from '../models/Teacher';
import Student from '../models/Student';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AsyncRequestHandler } from '../types/types';
import { Survey } from '../types/survey';

export const register: AsyncRequestHandler = async (req, res, next) => {
  try {
    const { name, email, password, school } = req.body;
    const teacher = await Teacher.create({ name, email, password, school });
    
    const token = jwt.sign(
      { id: teacher._id, role: 'teacher' },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRE } as jwt.SignOptions
    );

    res.status(201).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

export const login: AsyncRequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email }).select('+password');
    
    if (!teacher || !(await teacher.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: teacher._id, role: 'teacher' },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRE} as jwt.SignOptions
    );

    res.status(200).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

export const generateStudentHashes: AsyncRequestHandler = async (req, res, next) => {
  try {
    const { studentNames, surveyId, class: className } = req.body;
    
    const hashes = await Promise.all(
      studentNames.map(async (name: string) => {
        const hash = crypto.randomBytes(8).toString('hex');
        const student = new Student({
          name,
          hash,
          survey: surveyId,
          class: className
        });
        await student.save();
        return { name, hash };
      })
    );

    res.status(200).json({ success: true, data: hashes });
  } catch (error) {
    next(error);
  }
};

export const getMe: AsyncRequestHandler = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) {
      res.status(404).json({ success: false, message: 'Teacher not found' });
      return;
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

// Update studentLogin to populate survey data
export const studentLogin: AsyncRequestHandler = async (req, res, next) => {
  try {
    const { hash } = req.body;
    
    const student = await Student.findOne({ hash })
      .populate<{ survey: Survey }>('survey');

    if (!student) {
      throw Error("Invalid access code");
    }

    if (student.hasCompleted) {
      throw Error("Access code already used");
    }

    // Now TypeScript knows student.survey is populated
    const token = jwt.sign(
      { 
        id: student._id,
        survey: student.survey._id, // No more error here
        role: 'student' 
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRE } as jwt.SignOptions
    );

    // Mark as completed
    student.hasCompleted = true;
    await student.save();

    res.status(200).json({ 
      success: true, 
      token,
      surveyId: student.survey._id // No more error here
    });
  } catch (error) {
    next(error);
  }
};