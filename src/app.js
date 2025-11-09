import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

// router imports
import userRouter from './routes/user.route.js'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'

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
app.use(express.static(path.resolve("public")));
// cookie parser to handle cookies
app.use(cookieParser());

// registering separate routes for different uses
app.use('/api/v1/user',userRouter);
app.use('/api/v1/products',productRouter);
app.use('/api/v1/cart',cartRouter);

export { app };