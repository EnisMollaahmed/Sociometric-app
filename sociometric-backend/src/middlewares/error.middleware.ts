import { Request, Response, NextFunction } from 'express';
import { AsyncErrorHandler } from '../types/types';

export const errorHandler: AsyncErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Server Error' 
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ 
    success: false, 
    message: `Not Found - ${req.originalUrl}` 
  });
};