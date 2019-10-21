import { body, validationResult } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

const validateEnquiryForm = [
  body('fullName')
    .exists()
    .withMessage('Fullname is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('FullName must be at least 2 characters long'),
  sanitizeBody('fullName').trim().escape(),

  body('email')
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address entered')
    .normalizeEmail({ all_lowercase: true }),
  sanitizeBody('email').trim().escape(),

  body('enquiryType')
    .exists()
    .withMessage('This field cannot be empty'),
  sanitizeBody('enquiryType').trim().escape(),

  body('message', 'Message cannot be empty').isLength({ min: 1 }),
  sanitizeBody('message').trim().escape(),

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

export default validateEnquiryForm;
