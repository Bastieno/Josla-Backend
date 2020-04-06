import { Router } from 'express';
import formController from '../controllers/formController';

import validateEnquiryForm from '../middlewares/enquiryFormValidator';
import validateResumeForm from '../middlewares/resumeFormValidator';
import validateApplicationForm from '../middlewares/jobApplicationValidator';
import validateSubscriberForm from '../middlewares/subscriberFormValidator';

const router = Router();

// Root handler
router.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to JOSLA',
  });
});

// Route to make enquiry
router.post('/api/v1/enquiry', [validateEnquiryForm], formController.createEnquiry);

// Route to upload resume
router.post('/api/v1/upload-resume', [validateResumeForm], formController.uploadResume);

// Route to make job application
router.post('/api/v1/apply-job', [validateApplicationForm], formController.jobApplication);

// Route to subcribe to blog
router.post('/api/v1/subscribe', [validateSubscriberForm], formController.blogSubscription);

// Route to submit the contact form
router.post('/api/v1/send', formController.contactFormSubmission);

router.all('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: 'This route does not exist. Recheck parameters.',
  });
});

export default router;
