import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Teacher from '../models/Teacher';
import Student from '../models/Student';
import { AsyncMiddleware } from '../types/types';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect: AsyncMiddleware = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { 
      id: string, 
      role?: string 
    };
    
    if (decoded.role === 'student') {
      req.user = await Student.findById(decoded.id);
    } else {
      req.user = await Teacher.findById(decoded.id);
    }

    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const teacherOnly: AsyncMiddleware = async (req, res, next) => {
  if (!req.user?.school) {
    res.status(403).json({ success: false, message: 'Teacher access only' });
    return;
  }
  next();
};