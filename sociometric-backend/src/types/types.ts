import { Request, Response, NextFunction, RequestHandler } from 'express';

export type AsyncRequestHandler = RequestHandler;
export type AsyncMiddleware = RequestHandler;
export type AsyncErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;