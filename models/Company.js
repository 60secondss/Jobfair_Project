const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please Add company name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Company Name cannot be longer than 50 characters']
    },
    address:{
        type: String,
        required: [true, 'Please add company address']
    },
    district: {
        type: String,
        required: [true, 'Please add a district']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode: {
        type: String,
        required: [true, 'Please add a postal code'],
        maxlength: [5, "Postal Code can not be more than 5 digits"]
    },
    website: {
        type: String,
        required: [true, 'Please add company website']
    },
    description:{
        type: String,
        required:[true,'Please add company description']
    },
    telephonenumber: {
        type: String,
        required:[true,'Please add company phonenumber']
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

CompanySchema.virtual('interviews',{
    ref:'Interview',
    localField:'_id',
    foreignField:'company',
    justOne:false
});

module.exports=mongoose.model('Company', CompanySchema);