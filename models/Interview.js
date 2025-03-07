const mongoose= require('mongoose');


const InterviewSchema= new mongoose.Schema({
    intwDate:{
        type: Date,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    company:{
        type:mongoose.Schema.ObjectId,
        ref:'Company',
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Interview',InterviewSchema);

