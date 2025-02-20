const express=require('express')
const router=express.Router();
const Candidate=require('../Models/candidate');
const User=require('../Models/user')
const{jwtAuthMiddleware, generateToken} = require('../jwt');

const checkAdminRole= async (userID)=>{
    try{
        const user= await User.findById(userID);
        if(user.role == 'admin')
        {
            return true;
        }
    }
    catch(err){
        console.log(err)
        return false;
    }

}

//post to add candidate
router.post('/',jwtAuthMiddleware,async(req,res)=>{
 
    try{

        if(! await checkAdminRole(req.user.id))
            res.status(403).json({message:'User does not have admin Role'})   
    const data =req.body;
    
    if(await Candidate.findOne({name:data.name})){
        console.log("Candidate already exists");
        res.status(400).json("Candidate already exists");

    }
    const newCandidate= new Candidate(data);
    const response=  await newCandidate.save();
   
    console.log("Candidate data Saved")
    res.status(200).json(response)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"Internal Server error"})
    }
})

//update candidate

router.patch('/:candidateID',jwtAuthMiddleware, async (req,res)=>{
    try{
        if(!checkAdminRole(req.user.id)){
            res.status(403).json({message:'User does not have admin Role'})
        }
        
        const candidateID= req.params.candidateID;
        const updateddata=req.body;

        const response= await Candidate.findByIdAndUpdate(candidateID,updateddata,{
            new:true,
            runValidators:true,
        })
         if(!response){
            return res.status(404).json({error:'Candidate Not Found'})
         }
         console.log("candidate Updated")
        res.status(200).json({message:"Candidate updated",response})
        }
        catch(err){
            console.log(err)
            res.status(500).json({error:"Internal Server error"})
        }
})

//delete candidate

router.delete('/:candidateID',jwtAuthMiddleware, async (req,res)=>{
    try{
        if(!checkAdminRole(req.user.id)){
            res.status(403).json({message:'User does not have admin Role'})
        }
        
        const candidateID= req.params.candidateID;
        const response= await Candidate.findByIdAndDelete(candidateID)
         if(!response){
            return res.status(404).json({error:'Candidate Not Found'})
         }
         console.log("candidate deleted")
        res.status(200).json({message:"Candidate deleted"})
        }
        catch(err){
            console.log(err)
            res.status(500).json({error:"Internal Server error"})
        }
})



//voting

router.post('/vote/:candidateID',jwtAuthMiddleware, async (req,res)=>{
        const candidateID= req.params.candidateID;
        const userID=req.user.id;
    try{
        const candidate=await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({message:"Candidate not found"});
        }
        const user=await User.findById(userID); 
        if(!user){
            return res.status(404).json({message:"user not found"});   
        }
        if(user.isvoted){
          return  res.status(400).json({message:"you have already voted"}); 
        }
        if(user.role == 'admin'){
          return  res.status(400).json({message:"admin cannot voted"}); 
        }
        candidate.votes.push({user: userID,votedAt:Date.now()});
        candidate.voteCount++;
        await candidate.save();


        //update user
        user.isvoted=true;
        await user.save();
        console.log("vote noted")
        res.status(200).json({message:"vote recorded successfully"});
}
catch(err){
    console.log(err);
    res.status(500).json({message:err});
}

})

//vote count
router.get('/vote/count',async (req,res)=>{
try{

    const candidate= await Candidate.find().sort({voteCount:'desc'});
    const record=candidate.map((data)=>{
        return{
            party: data.party,
            count: data.voteCount
        }
    });
 ;
    res.status(200).json(record);
    console.log(record);
}
catch(err){
    console.log(err);
    res.status(500).json({message:err});
}
});

//list of candidates
router.get('/view',async (req,res)=>{
    try{
        const data= await Candidate.find();
        const record= data.map((data)=>{
           return{
            name: data.name,
            party: data.party,
            age: data.age
        }
        })
        res.status(200).json(record);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
})

module.exports=router;