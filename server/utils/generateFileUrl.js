import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();

const cloud = cloudinary.v2;
const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;


cloud.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

// const fileUrl = (file) => {
//   cloud.uploader.upload(file.tempFilePath, (err, result) => {
//     if (err) {
//       throw err;
//     } else {
//       return { url: result.secure_url };
//     }
//   });
// };

const generateFileUrl = file => new Promise((resolve, reject) => {
  cloud.uploader.upload(file.tempFilePath, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve({ fileUrl: result.secure_url });
    }
  });
});

export default generateFileUrl;
