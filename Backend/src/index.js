import connectDB from './db/index.js';
import dotenv from 'dotenv';
import { app } from './app.js';
dotenv.config({
    path:'./env'
})

connectDB().then(()=>{
   app.listen(process.env.port||3000,()=>{
    console.log(`Server is listening on PORT ${process.env.port}`)
   })
}).catch((err)=>{
    console.log("MONGO db connection failed",err)
})
