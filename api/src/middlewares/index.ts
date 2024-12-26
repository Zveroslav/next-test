import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const reviewSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  author: Joi.string().required(),
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    "number.base": "Page must be a number.",
    "number.min": "Page must be at least 1.",
  }),
  author: Joi.string().optional().allow(null, "").messages({
    "string.base": "Author must be a string.",
  }),
  rating: Joi.alternatives()
    .try(
      Joi.array().items(Joi.number().integer().min(1).max(5)),
      Joi.string().regex(/^\[.*\]$/, "array string")
    )
    .optional()
    .allow("")
    .messages({
      "array.includes": "Rating must be an array of numbers between 1 and 5.",
      "string.pattern.name": "Rating array must be a valid JSON array string.",
    }),
  sorting: Joi.string().optional().allow(null, "").messages({
    "string.base": "Sorting must be a string.",
  }),
});

// Middleware function to validate and sanitize query parameters
export const validateAndSanitizeQueryParams = (req, res, next) => {
  // Validate and strip invalid params
  const { error, value } = querySchema.validate(req.query, {
    allowUnknown: true, // Allow unknown params (to retain other params in query)
    stripUnknown: true, // Remove unknown params not in schema
  });

  if (!error) {
    // Filter out empty values
    req.query = Object.fromEntries(
      Object.entries(value).filter(([_, v]) => v !== "" && v !== null)
    );
    return next();
  }

  // If validation error occurs, still proceed with sanitized params
  req.query = Object.fromEntries(
    Object.entries(value).filter(([_, v]) => v !== "" && v !== null)
  );
  next();
};

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next(); // Pass control to the next middleware or route handler
};

