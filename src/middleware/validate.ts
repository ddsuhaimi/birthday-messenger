import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "./error-handler";

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (error: any) {
      // Handle error based on its type
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: formatZodError(err),
        }));

        next(new AppError(400, "Validation failed", formattedErrors));
      } else {
        next(new AppError(400, "Invalid input"));
      }
    }
  };
};

function formatZodError(error: any): string {
  const fieldName = error.path[error.path.length - 1];

  switch (error.code) {
    case "invalid_type":
      if (error.received === "undefined") {
        return `${fieldName} is required`;
      }
      return `${fieldName} must be a ${error.expected}`;

    case "too_small":
      if (error.type === "string") {
        return `${fieldName} must be at least ${error.minimum} characters`;
      }
      return `${fieldName} must be greater than ${error.minimum}`;

    case "too_big":
      if (error.type === "string") {
        return `${fieldName} must be at most ${error.maximum} characters`;
      }
      return `${fieldName} must be less than ${error.maximum}`;

    case "invalid_string":
      if (error.validation === "email") {
        return `${fieldName} must be a valid email address`;
      }
      return `${fieldName} is invalid`;

    case "custom":
      return error.message;

    default:
      return error.message || `${fieldName} is invalid`;
  }
}
