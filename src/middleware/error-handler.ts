import { Request, Response, NextFunction } from "express";

interface ValidationError {
  field: string;
  message: string;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: ValidationError[]
  ) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      errors: err.errors || undefined,
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
