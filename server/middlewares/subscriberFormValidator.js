import { body, validationResult } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

const validateSubscriberForm = [
  body('email')
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address entered')
    .normalizeEmail({ all_lowercase: true }),
  sanitizeBody('email').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 400,
        error: errors.array().map(error => error.msg)[0],
      });
    } else {
      next();
    }
  }
];

export default validateSubscriberForm;
