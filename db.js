const mongoose=require('mongoose')
const dburl='mongodb://localhost:27017/Voting_App';
mongoose.connect(dburl)
const db=mongoose.connection;


db.on('connected',()=>console.log('Database Connected'));
db.on('disconnected',()=>console.log('Database Disonnected'));
db.on('error',(error)=>console.error('Database error',error));

module.exports=db;
