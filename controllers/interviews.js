const Interview= require('../models/Interview');
const Company= require('../models/Company');

//@dec      Get all interviews
//@route    GET/api/v1/interviews
//@access   Public
exports.getInterviews = async (req,res,next)=>{
    let query;
    //General users can see only their interview
    if(req.user.role !== 'admin'){
        query=Interview.find({user:req.user.id}).populate({
            path:'company',
            select: 'name province telephonenumber'
        });
    }else{
        if(req.params.companyId){
            console.log(req.params.companyId);
            query=Interview.find({company:req.params.companyId}).populate({
                path:'company',
                select: 'name province telephonenumber'
            });
        }else query=Interview.find().populate({
            path:'company',
            select: 'name province telephonenumber'
        });
    }
    try{
        const interviews=await query;

        res.status(200).json({
            success:true,
            count:interviews.length,
            data: interviews
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Interview Booking"});
    }
};



//@desc         Get Single interview
//@route        GET/api/v1/interviews/:id
//@access       Public
exports.getInterview=async(req,res,next)=>{
    try{
        const interview=await Interview.findById(req.params.id).populate({
            path:'company',
            select:'name description telephonenumber'
        });
        if(!interview){
            return res.status(404).json({success:false,message:`No Interview Booking with the id of ${req.params.id}`})
        }
        res.status(200).json({
            success:true,
            data:interview
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,message:"Cannot find interview booking"});
    }
};



//@desc         Add interview
//@route        POST/api/v1/companies/:companyId/interview
//@access       Private
exports.addInterview=async(req,res,next)=>{
    try{
        req.body.company=req.params.companyId;
        const company=await Company.findById(req.params.companyId);
        if(!company){
            return res.status(404).json({success:false,message: `No company with the id of ${req.params.companyId} `});

        }
        //add user Id to req.body
        req.body.user=req.user.id;
        //Check for existed interview
        const existedInterview= await Interview.find({user:req.user.id});
        //If the user is not an admin, they can only create 3 interview
        if(existedInterview.length>=3 && req.user.role !== 'admin'){
            return res.status(400).json({
                success:false,
                message:`The user with ID ${req.user.id} has already made 3 interviews booking`
            });
            
        }
        const interview=await Interview.create(req.body);
        res.status(200).json({
            success:true,
            data:interview
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot create Interview booking'
        });
    }
};

//@desc         Update interview
//@route        PUT/api/v1/interviews/:id
//@access       Private
exports.updateInterview=async(req,res,next)=>{
    try{
        let interview= await Interview.findById(req.params.id);
        if(!interview){
            return res.status(404).json({success:false,message: `No Interview Booking with the id of ${req.params.id} `});

        }
        //Make sure user is the interview owner
        if(interview.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({
                success:false,
                message:`User with ID ${req.user.id} is not authorized to update this interview booking`
            });
            
        }


        interview=await Interview.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            data:interview
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot update Interview booking'
        });
    }
};


//@desc         Delete interview
//@route        Delete/api/v1/interviews/:id
//@access       Private
exports.deleteInterview=async(req,res,next)=>{
    try{
        const interview= await Interview.findById(req.params.id);
        if(!interview){
            return res.status(404).json({success:false,message: `No interview booking with the id of ${req.params.id} `});

        }
        //Make sure user is the interview owner
        if(interview.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorized to delete this interview booking`
            });
            
        }
        await interview.deleteOne();
        res.status(200).json({
            success:true,
            data:{}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot delete Interview booking'
        });
    }
};


