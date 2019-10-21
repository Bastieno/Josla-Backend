import express from 'express';
import log from 'fancy-log';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import router from './routes';

const app = express();
const port = process.env.PORT || 6000;

// enable file upload
app.use(fileUpload({
  createParentPath: true,
  useTempFiles: true
}));

// add other middlewares
app.use(cors());
app.use(helmet());
app.use(compression()); // Compress all routes
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(router);

// Implement the 'catch-all' errorHandler
app.use((err, req, res, next) => {
  log('err.stack :', err.stack);
  res.status(500);
  res.json({
    message: 'Hey!! we caught the error 👍👍',
    error: `${err}`,
    status: 'failure'
  });
});

app.listen(port, () => {
  log(`Server started on port ${port}`);
});

export default app;
