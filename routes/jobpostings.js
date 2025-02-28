const express = require('express');
const { getJobpostings, getJobposting, createJobposting, updateJobposting, deleteJobposting } = require('../controllers/jobpostings');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth'); // Import authentication middleware

// Get all job postings (Public)
router.route('/')
    .get(getJobpostings);

// Get a specific job posting by ID (Public)
router.route('/:id')
    .get(getJobposting) // Public - Anyone can view a job posting
    .put(protect, authorize('admin'), updateJobposting) // Only admin or company can update
    .delete(protect, authorize('admin'), deleteJobposting); // Only admin or company can delete

// Create a new job posting for a specific company (Private - Admin or Company required)
router.route('/:companyId')
    .post(protect, authorize('admin'), createJobposting); // Only admin or company can post jobs

module.exports = router;
  