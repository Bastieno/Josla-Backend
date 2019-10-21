// import log from 'fancy-log';
import handleResponse from '../utils/responseHandler';
import {
  createEnquiry, uploadResume, applyJob, subscribeBlog
} from '../model/form-dao';

/**
 *
 * @description Represent a collection of form route handlers
 * @class FormController
 */
class FormController {
  /**
   *
   * @description Create a new enquiry
   * @static
   * @param {Request} req - Request Object
   * @param {Response} res - Response Object
   * @param {object} next - the next middleware function in the request-response cycle
   */
  static createEnquiry(req, res, next) {
    createEnquiry(req.body)
      .then((result) => {
        const { data, statusCode } = result;
        handleResponse(res, data, statusCode, 'Enquiry submitted successfully');
      }).catch(err => next(err));
  }

  /**
   *
   * @description Create a new resume upload
   * @static
   * @param {Request} req - Request Object
   * @param {Response} res - Response Object
   * @param {object} next - the next middleware function in the request-response cycle
   */
  static uploadResume(req, res, next) {
    uploadResume(req)
      .then((result) => {
        const { data, statusCode } = result;
        handleResponse(res, data, statusCode, 'Resume submitted successfully');
      }).catch(err => next(err));
  }

  /**
   *
   * @description Create a new job application
   * @static
   * @param {Request} req - Request Object
   * @param {Response} res - Response Object
   * @param {object} next - the next middleware function in the request-response cycle
   */
  static jobApplication(req, res, next) {
    applyJob(req)
      .then((result) => {
        const { data, statusCode } = result;
        handleResponse(res, data, statusCode, 'Application submitted successfully');
      }).catch(err => next(err));
  }

  /**
   *
   * @description Subscribe to blog
   * @static
   * @param {Request} req - Request Object
   * @param {Response} res - Response Object
   * @param {object} next - the next middleware function in the request-response cycle
   */
  static blogSubscription(req, res, next) {
    subscribeBlog(req.body)
      .then((result) => {
        const { data, statusCode } = result;
        handleResponse(res, data, statusCode, 'Subscribed successfully');
      }).catch(err => next(err));
  }
}

export default FormController;
