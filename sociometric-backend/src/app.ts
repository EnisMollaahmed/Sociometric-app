import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import surveyRoutes from './routes/survey.routes';
import { notFound, errorHandler } from './middlewares/error.middleware';

const port = process.env.PORT || 3000

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(morgan('dev'));


app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);


app.use(notFound);
app.use(errorHandler);

app.listen(port);

export default app;
