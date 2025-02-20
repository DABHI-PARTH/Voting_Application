const jwt=require('jsonwebtoken');

const jwtAuthMiddleware=(req,res,next)=>{

    // checking request header
    const authorization= req.headers.authorization;
    if(!authorization)
    {
        return res.status(401).json({error:"Token not found"});
    }
    // extract the jwt token
     const token=req.headers.authorization.split(' ')[1];
     if(!token) return res.status(401).json({error:"Unauthorized"});

     //verify jwt token
       try{
        const decoded =jwt.verify(token,process.env.JWT_SECRET); 
        req.user=decoded
        next();
       }
       catch(err){
        console.log(err);
        res.status(401).json({error:'Invalid token'})
       }

}
const generateToken=(payloaddata)=>{
    return jwt.sign(payloaddata,process.env.JWT_SECRET)
}


module.exports={
    jwtAuthMiddleware, generateToken
} 