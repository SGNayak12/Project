import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.routes.js'
import cookieParser from 'cookie-parser';

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use("/api/users", userRouter);
export {app};