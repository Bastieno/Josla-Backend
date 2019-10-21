import log from 'fancy-log';
import uuidv4 from 'uuid/v4';
import dbCloudantConnect from '../utils/connection';
import generateFileUrl from '../utils/generateFileUrl';

// Cloudant DB reference
let db;

// Initialize the DB when this module is loaded
(function getDbConnection() {
  log('Initializing Cloudant connection...');
  dbCloudantConnect().then((database) => {
    log('Cloudant connection initialized.');
    db = database;
  }).catch((err) => {
    log(`Error while initializing DB: ${err.message}`);
    throw err;
  });
}());

export const createEnquiry = requestBody => new Promise(async (resolve, reject) => {
  try {
    const {
      fullName, email, enquiryType, message
    } = requestBody;

    const formId = uuidv4();
    const whenCreated = Date.now();

    const enquiry = {
      _id: formId,
      id: formId,
      type: 'enquiryForm',
      fullName,
      email,
      enquiryType,
      message,
      whenCreated
    };

    db.insert(enquiry, (err, result) => {
      if (err) {
        log(`Error occured: ${err.message}`);
        reject(err);
      } else {
        resolve({ data: { createdId: result.id, createdRevId: result.rev }, statusCode: 201 });
      }
    });
  } catch (error) {
    reject(error);
  }
});

export const uploadResume = request => new Promise(async (resolve, reject) => {
  try {
    const {
      fullName, email, portfolioLink, aboutYou
    } = request.body;
    const { uploadCv } = request.files;
    const formId = uuidv4();
    const whenCreated = Date.now();

    const { fileUrl } = await generateFileUrl(uploadCv);
    const formData = {
      _id: formId,
      id: formId,
      type: 'uploadResume',
      fullName,
      email,
      portfolioLink,
      cvUrl: fileUrl,
      aboutYou,
      whenCreated
    };

    db.insert(formData, (err, result) => {
      if (err) {
        log(`Error occured: ${err.message}`);
        reject(err);
      } else {
        resolve({ data: { createdId: result.id, createdRevId: result.rev }, statusCode: 201 });
      }
    });
  } catch (error) {
    reject(error);
  }
});

export const applyJob = request => new Promise(async (resolve, reject) => {
  try {
    const {
      fullName, email, phoneNumber, position, coverLetter
    } = request.body;
    const { resume } = request.files;

    const formId = uuidv4();
    const whenCreated = Date.now();
    const { fileUrl } = await generateFileUrl(resume);
    const ApplicationData = {
      _id: formId,
      id: formId,
      type: 'applyJob',
      fullName,
      email,
      phoneNumber,
      position,
      coverLetter,
      resumeUrl: fileUrl,
      whenCreated
    };

    db.insert(ApplicationData, (err, result) => {
      if (err) {
        log(`Error occured: ${err.message}`);
        reject(err);
      } else {
        resolve({ data: { createdId: result.id, createdRevId: result.rev }, statusCode: 201 });
      }
    });
  } catch (error) {
    reject(error);
  }
});

export const subscribeBlog = requestBody => new Promise(async (resolve, reject) => {
  try {
    const { email } = requestBody;

    const formId = uuidv4();
    const whenCreated = Date.now();

    const formData = {
      _id: formId,
      id: formId,
      type: 'subscribeBlog',
      email,
      whenCreated
    };

    db.insert(formData, (err, result) => {
      if (err) {
        log(`Error occured: ${err.message}`);
        reject(err);
      } else {
        resolve({ data: { createdId: result.id, createdRevId: result.rev }, statusCode: 201 });
      }
    });
  } catch (error) {
    reject(error);
  }
});
