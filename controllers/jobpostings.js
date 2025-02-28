const Jobposting = require('../models/Jobposting'); // Import Jobposting model
const Company = require('../models/Company'); // Import Company model

// @desc    Get all job postings
// @route   GET /api/jobpostings
// @access  Public
/*
exports.getJobpostings = async (req, res) => {
    try {
        const jobpostings = await Jobposting.find().populate({path:'company'}); 
        res.status(200).json({ success: true, count: jobpostings.length, data: jobpostings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};*/

// @desc    Get all job postings
// @route   GET /api/jobpostings
// @access  Public
exports.getJobpostings = async (req, res, next) => {
    let query;

    // Copy req.query to avoid mutation
    const reqQuery = { ...req.query };

    // Fields to exclude from the query (pagination, sorting, etc.)
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc.)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resources (job postings)
    query = Jobposting.find(JSON.parse(queryStr)).populate('company'); // Populate company details

    // Select fields (specific columns to include)
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort fields
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        // Default sort by posted_date in descending order
        query = query.sort('-posted_date');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const total = await Jobposting.countDocuments();
        
        // Apply skip and limit for pagination
        query = query.skip(startIndex).limit(limit);

        // Execute the query to fetch job postings
        const jobpostings = await query;

        // Pagination result structure
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }
        // Return response with pagination metadata
        res.status(200).json({
            success: true,
            count: jobpostings.length,
            pagination,
            data: jobpostings,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// @desc    Get a single job posting by ID
// @route   GET /api/jobpostings/:id
// @access  Public
exports.getJobposting = async (req, res) => {
    try {
        const jobposting = await Jobposting.findById(req.params.id).populate({path:'company'});
        if (!jobposting) {
            return res.status(404).json({ success: false, message: 'Job posting not found' });
        }
        res.status(200).json({ success: true, data: jobposting });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a new job posting
// @route   POST /api/jobpostings/:companyId
// @access  Private (Company required)
exports.createJobposting = async (req, res) => {
    try {
        const { title, jobdescription, requirement, salary_range, jobtype } = req.body;
        const companyId = req.params.companyId; // Get company ID from the route parameter

        // Check if the company exists
        const existingCompany = await Company.findById(companyId);
        if (!existingCompany) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        //Validation Jobtype
        const validJobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];
        if (!validJobTypes.includes(jobtype)) {
            return res.status(422).json({ success: false, message: 'Invalid job type. There are only 4 options available: Full-time, Part-time, Contract, Internship, Temporary '});
        }

        // Create job posting
        const jobposting = await Jobposting.create({
            company: companyId, // Link job posting to the company
            title,
            jobdescription,
            requirement,
            salary_range,
            jobtype
        });

        res.status(201).json({ success: true, data: jobposting });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update a job posting
// @route   PUT /api/jobpostings/:id
// @access  Private (Company required)
exports.updateJobposting = async (req, res) => {
    try {
        let jobposting = await Jobposting.findById(req.params.id);
        if (!jobposting) {
            return res.status(404).json({ success: false, message: 'Job posting not found' });
        }

        // Update job posting
        jobposting = await Jobposting.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: jobposting });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobpostings/:id
// @access  Private (Company required)
exports.deleteJobposting = async (req, res) => {
    try {
        const jobposting = await Jobposting.findById(req.params.id);
        if (!jobposting) {
            return res.status(404).json({ success: false, message: 'Job posting not found' });
        }

        await jobposting.deleteOne();
        res.status(200).json({ success: true, message: 'Job posting deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
