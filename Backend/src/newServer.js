import express from 'express';
const app=express();


app.get("/",(req,res)=>{
    res.send("Hello");
})

app.listen(process.env.PORT,()=>{
    console.log(`App is listening on PORT ${process.env.PORT}`);
})