import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Survey from '../models/Survey';
import Question from '../models/Question';
import Student from '../models/Student';
import { AsyncRequestHandler } from '../types/types';

export const getTeacherSurveys: AsyncRequestHandler = async (req, res, next) => {
  try {
    const surveys = await Survey.find({ teacher: req.user._id })
      .populate('questions')
      .populate('students');
    res.json({ success: true, data: surveys });
  } catch (error) {
    next(error);
  }
};

export const getSurveyResults: AsyncRequestHandler = async (req, res, next) => {
  try {
    const survey = await Survey.findById(req.params.id)
      .populate('questions')
      .populate('students');

    if (!survey) {
      res.status(404).json({ success: false, message: 'Survey not found' });
      return;
    }

    res.status(200).json({ 
      success: true, 
      data: survey
    });
  } catch (error) {
    next(error);
  }
};

export const createSurvey: AsyncRequestHandler = async (req, res, next) => {
  try {
    const { title, description, class: className, questions } = req.body;

    const survey = await Survey.create({
      title,
      description,
      class: className,
      teacher: req.user.id,
      questions,
      status: 'draft'
    });

    res.status(201).json({ success: true, data: survey });
  } catch (error) {
    next(error);
  }
};

export const getSurveyForStudent: AsyncRequestHandler = async (req, res, next) => {
  try {
    const survey = await Survey.findById(req.params.id)
      .populate('questions')
      .select('-students -teacher');
    
    if (!survey) {
      res.status(404).json({ success: false, message: 'Survey not found' });
      return;
    }

    res.status(200).json({ success: true, data: survey });
  } catch (error) {
    next(error);
  }
};

export const submitSurvey: AsyncRequestHandler = async (req, res, next) => {
  try {
    const { responses } = req.body;
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    if (!student || student.hasCompleted) {
      res.status(400).json({ success: false, message: 'Invalid submission' });
      return;
    }

    student.responses = responses;
    student.hasCompleted = true;
    await student.save();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};