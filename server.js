const express= require('express');
const app =express();
require('dotenv').config();
const port =process.env.PORT || 3000
const bodyparser=require('body-parser');
app.use(bodyparser.json());
const db=require('./db')
const userroutes=require('./Routes/userRoutes')
const candidateroutes=require('./Routes/candidateRoutes ')


app.use('/user',userroutes);
app.use('/candidate',candidateroutes);
app.listen(port,()=>console.log("Server Running "))