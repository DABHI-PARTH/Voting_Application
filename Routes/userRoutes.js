const express=require('express')
const router=express.Router();
const User=require('../Models/user');
const{jwtAuthMiddleware, generateToken} = require('../jwt');



//signup
router.post('/signup',async(req,res)=>{
 
    try{
        const data =req.body;
        if(await User.findOne({aadharCardNumber:data.aadharCardNumber})){
            console.log("User already exists");
            res.status(400).json("User already exists");
          }
             
             if(req.body.role == 'admin')
              {
                console.log("User already exists with admin role");
                res.status(403).json({message:'User already exists with admin role'}) 
              }   
              else{     
              const newUser= new User(data);
              console.log("User data Saved")
              const response=  await newUser.save();
              const payload={ id: response.id }
              console.log(JSON.stringify(payload));
              const token = generateToken(payload);
              console.log("Token is:",token);
              res.status(200).json({response})
                  } 
     }
          catch(err){
               console.log(err)
               res.status(500).json({error:"Internal Server error"})
                    }
     })

//login route
router.post('/login',jwtAuthMiddleware,async(req,res)=>{
 
    try{ 
    const {aadharCardNumber, password} =req.body;
    const user= await User.findOne({aadharCardNumber});
     
    if(!user || !(await user.comparePassword(password))){
        return res.status(401).json({error:'Invalid username or password'});

    }
    const payload={
        id: user.id,
    }
    const token = generateToken(payload);
    res.status(200).json({token_is:token,user})
    console.log("User login Sucessfully")
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"Internal Server error"})
    }
})


router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
 
    try{
    const userData =req.user;
    const userId= userData.id;
    const user= await User.findById(userId);
     
    res.status(200).json({user})
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"Internal Server error"})
    }
})


router.patch('/profile/password',jwtAuthMiddleware, async (req,res)=>{
    try{
        const userData =req.user;
        const userId= userData.id;
        const {currentpassword ,newpassword} =req.body
        const user= await User.findById(userId);

        if( !(await user.comparePassword(currentpassword))){
            return res.status(401).json({error:'Invalid username or password'});
    
        }
        user.password = newpassword;
        await user.save();

        console.log("user password updated"); 
        res.status(200).json({message:"password updated"})
        }
        catch(err){
            console.log(err)
            res.status(500).json({error:"Internal Server error"})
        }
})
module.exports=router;