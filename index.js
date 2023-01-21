const connectToMongo=require('./db');
const express=require('express');

const PORT=3000

connectToMongo();

const app=express();

//available routes 
app.use('/api/auth',require('./routes/auth'))

app.listen(PORT,()=>{
    console.log(`listining at http://localhost:${PORT}`)
})