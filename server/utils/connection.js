import log from 'fancy-log';
import Cloudant from '@cloudant/cloudant';
import dotenv from 'dotenv';

dotenv.config();

const { CLOUDANT_URL, CLOUDANT_DB_NAME } = process.env;

/**
 * Connects to the Cloudant DB
 * @return {Promise} - when resolved, contains the db, ready to go
 */
function dbCloudantConnect() {
  return new Promise((resolve, reject) => {
    Cloudant({
      url: CLOUDANT_URL
    }, ((err, cloudant) => {
      if (err) {
        log(`Connect failure: ${err.message} for Cloudant DB: ${CLOUDANT_DB_NAME}`);
        reject(err);
      } else {
        const db = cloudant.use(CLOUDANT_DB_NAME);
        log(`Connect success! Connected to DB: ${CLOUDANT_DB_NAME}`);
        resolve(db);
      }
    }));
  });
}

export default dbCloudantConnect;
