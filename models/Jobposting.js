const mongoose = require('mongoose');

// Define Job Posting Schema
const JobpostingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        index: false 
    },
    jobdescription: {
        type: String,
        required: [true, 'Please add a job description']
    },
    requirement: {
        type: String,
        required: [true, 'Please add job requirements']
    },
    salary_range: {
        type: String,
        required: [true, 'Please specify a salary range']
    },
    jobtype: {
        type: String,
        required: [true, 'Please specify the job type'],
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary']
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: [true, 'Job posting must be linked to a company']
    },
    posted_date: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});



module.exports = mongoose.model('Jobposting', JobpostingSchema);
