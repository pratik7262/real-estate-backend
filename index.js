const connectToMongo=require('./db');
const express=require('express');

const PORT=5000

connectToMongo();

const app=express();

app.use(express.json())

//available routes 
app.use('/api/auth',require('./routes/auth'))

app.listen(PORT,()=>{
    console.log(`listining at http://localhost:${PORT}`)
})