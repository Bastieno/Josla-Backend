import log from 'fancy-log';
import uuidv4 from 'uuid/v4';
import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import uniqid from 'uniqid';
import dotenv from 'dotenv';
import dbCloudantConnect from '../utils/connection';
import generateFileUrl from '../utils/generateFileUrl';

dotenv.config();

const { SENDGRID_API_KEY, GMAIL_ACCOUNT, GMAIL_PASSWORD } = process.env;

// Cloudant DB reference
let db;

// Setting Send grid api key
sgMail.setApiKey(SENDGRID_API_KEY);

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

export const submitContactForm = requestBody => new Promise(async (resolve, reject) => {
  try {
    const {
      projectType,
      projectBudget,
      email,
      companyName,
      briefDescription
    } = requestBody;

    const message = `<span style="font-size: 15px; color: #2aa275; font-family: Roboto">You have a new message with the following details:</span>
        <p style="font-size: 15px; color: rgba(52, 61, 76, 0.8); font-family: Roboto"><strong>Company Name:</strong> ${companyName}</p>
        <p style="font-size: 15px; color: rgba(52, 61, 76, 0.8); font-family: Roboto"><strong>Email Address:</strong> ${email}</p>
        <p style="font-size: 15px; color: rgba(52, 61, 76, 0.8); font-family: Roboto"><strong>Project Type:</strong> ${projectType.label}</p>
        <p style="font-size: 15px; color: rgba(52, 61, 76, 0.8); font-family: Roboto"><strong>Project Budget:</strong> ${projectBudget.label}</p>
        <p style="font-size: 15px; color: rgba(52, 61, 76, 0.8); font-family: Roboto"><strong>Brief Description:</strong> ${briefDescription}</p>
        <p style="font-size: 15px; color: rgba(52, 61, 76, 0.8); font-family: Roboto">Please respond to this mail within the next 48 hours.</p>
      `;

    const mailOptions = {
      to: 'francis.nduamaka@gmail.com',
      from: 'francis.nduamaka@gmail.com',
      subject: `New message from <${email}>`,
      text: briefDescription,
      html: message
    };

    const formId = uuidv4();
    const whenCreated = Date.now();

    const formData = {
      _id: formId,
      id: formId,
      type: 'contactForm',
      whenCreated,
      companyName,
      email,
      briefDescription,
      projectType,
      projectBudget
    };

    await sgMail.send(mailOptions);

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

export const submitContactFormNodeMailer = requestBody => new Promise(async (resolve, reject) => {
  try {
    const {
      projectType,
      projectBudget,
      email,
      companyName,
      briefDescription
    } = requestBody;

    const ticketId = uniqid.time('opendesk-');

    const mailContent = `<span style="font-size: 15px; color: #2aa275; font-family: Roboto">You have a new message with the following details:</span>
        <p style="font-size: 15px; color: rgba(52, 61, 76, 0.8); font-family: Roboto"><strong>Company Name:</strong> ${companyName}</p>
        <p style="font-size: 15px; color: rgba(52, 61, 76, 0.8); font-family: Roboto"><strong>Email Address:</strong> ${email}</p>
        <p style="font-size: 15px; color: rgba(52, 61, 76, 0.8); font-family: Roboto"><strong>Project Type:</strong> ${projectType.label}</p>
        <p style="font-size: 15px; color: rgba(52, 61, 76, 0.8); font-family: Roboto"><strong>Project Budget:</strong> ${projectBudget.label}</p>
        <p style="font-size: 15px; color: rgba(52, 61, 76, 0.8); font-family: Roboto"><strong>Brief Description:</strong> ${briefDescription}</p>
        <p style="font-size: 15px; color: rgba(52, 61, 76, 0.8); font-family: Roboto"><strong>TicketId:</strong> ${ticketId}</p>
        <p style="font-size: 15px; color: rgba(52, 61, 76, 0.8); font-family: Roboto">Please respond to this mail within the next 48 hours.</p>
      `;

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com.',
      port: 587,
      secure: false,
      auth: {
        user: GMAIL_ACCOUNT,
        pass: GMAIL_PASSWORD
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    // verify connection configuration
    transporter.verify((error, _success) => {
      if (error) {
        log(error);
      } else {
        log('Server is ready to take our messages');
      }
    });

    // Message object
    const message = {
      from: 'Opendesk Contact Form <opendeskconsult@gmail.com>',
      to: 'Info Opendesk <info@opendeskng.com>',
      bcc: 'francis.nduamaka@opendeskng.com',
      subject: 'New Message from the Opendesk Contact Form ✔',
      text: briefDescription,
      html: mailContent
    };

    const formId = uuidv4();
    const whenCreated = Date.now();

    const formData = {
      _id: formId,
      id: formId,
      ticketId,
      type: 'contactForm',
      whenCreated,
      companyName,
      email,
      briefDescription,
      projectType,
      projectBudget
    };

    const info = await transporter.sendMail(message);
    log('Message sent successfully as %s', info.messageId);

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
