const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const userschema= new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
    },
    mobile:{
        type:Number,   
    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter',
    },
    isvoted:{
        type:Boolean,
        default:false,
    }

});

userschema.pre('save',async function(next){

    if(!this.isModified('password')) return next();

    try{

        const salt =await bcrypt.genSalt(10);

        this.password = await bcrypt.hash(this.password, salt);
    
        next();
    }
    catch(err){
        return next(err);
    } 
})

userschema.methods.comparePassword= async function(candidatepassword) {
  try{
    return await bcrypt.compare(candidatepassword,this.password); 
    
  } 
  catch(err){
    throw new Error('Error comparing passwords');
  }
}
const User= mongoose.model('User',userschema);
module.exports=User;
