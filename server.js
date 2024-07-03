const express =require("express");
const conndb=require('./config/conndb');
const routevenue=require("./routes/routevenue")
const dotenv= require("dotenv");
const path=require("path");
dotenv.config();
conndb();
console.log('PORT:', process.env.PORT); // Check if PORT is correctly loaded
console.log('MONGODB_URI:', process.env.MONGO_URI);
const app=express();
const port=process.env.PORT||4070;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get("/",(req,res)=>{
    res.send('hii');
})
app.use(express.json());
app.use('/api/venue',routevenue);

app.listen(port,()=>{
    console.log(`Server running at ${port}`)
})