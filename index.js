const connectToMongo=require('./db');
const express=require('express');

const PORT=3000

connectToMongo();

const app=express();

app.get('/',(req,res)=>{
    res.send('this is main path');
})

app.listen(PORT,()=>{
    console.log(`listining at http://localhost:${PORT}`)
})