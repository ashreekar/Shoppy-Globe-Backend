import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// initialising an express app
const app = express();

// allowing cors origin
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));
// middlewares that handles both json and urlencoded data
app.use(express.json());
app.use(express.urlencoded());

// middleware to serve static assets
app.use(express.static('public'));
// cookie parser to handle cookies
app.use(cookieParser());

export { app };