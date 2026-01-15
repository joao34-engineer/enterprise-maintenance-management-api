import { validationResult } from "express-validator";
export const handleInputErrors = (req, res, next) => {
  const errors = validationResult(req)
    
  if (!errors.isEmpty()) {
    const err = new Error('Invalid input') as any;
    err.type  = 'input';
    return next(err);
  } else {
    next()
  }
}
