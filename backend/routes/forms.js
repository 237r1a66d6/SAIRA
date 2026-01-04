const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// Models
const Enrollment = require('../models/Enrollment');
const SchoolRequirement = require('../models/SchoolRequirement');
const TeacherApplication = require('../models/TeacherApplication');
const MentorApplication = require('../models/MentorApplication');
const JobApplication = require('../models/JobApplication');
const Contact = require('../models/Contact');
const Consultation = require('../models/Consultation');

// @route   POST /api/forms/enrollment
// @desc    Submit enrollment for mentorship/training program
// @access  Public
router.post('/enrollment', async (req, res) => {
    try {
        const { fullName, email, phone, program, experience, message } = req.body;

        // Create new enrollment
        const enrollment = new Enrollment({
            fullName,
            email,
            phone,
            program,
            experience,
            message
        });

        await enrollment.save();

        res.json({ 
            success: true,
            message: 'Enrollment submitted successfully',
            enrollmentId: enrollment._id
        });
    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error submitting enrollment' 
        });
    }
});

// @route   POST /api/forms/school-requirement
// @desc    Submit school teacher requirement
// @access  Public
router.post('/school-requirement', async (req, res) => {
    try {
        const {
            schoolName,
            schoolLocation,
            contactPerson,
            contactEmail,
            contactPhone,
            positionType,
            subject,
            grades,
            experience,
            salary,
            additionalInfo
        } = req.body;

        const requirement = new SchoolRequirement({
            schoolName,
            schoolLocation,
            contactPerson,
            contactEmail,
            contactPhone,
            positionType,
            subject,
            grades,
            experience,
            salary,
            additionalInfo
        });

        await requirement.save();

        res.json({
            success: true,
            message: 'School requirement submitted successfully',
            requirementId: requirement._id
        });
    } catch (error) {
        console.error('School requirement error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting school requirement'
        });
    }
});

// @route   POST /api/forms/teacher-application
// @desc    Submit teacher job application
// @access  Public
router.post('/teacher-application', upload.single('teacherResume'), async (req, res) => {
    try {
        const {
            teacherName,
            teacherEmail,
            teacherPhone,
            teacherQualification,
            teacherSubject,
            teacherExperience,
            preferredLocation,
            currentSalary,
            coverLetter
        } = req.body;

        const application = new TeacherApplication({
            teacherName,
            teacherEmail,
            teacherPhone,
            teacherQualification,
            teacherSubject,
            teacherExperience,
            preferredLocation,
            currentSalary,
            coverLetter,
            resumeUrl: req.file ? req.file.path : null
        });

        await application.save();

        res.json({
            success: true,
            message: 'Teacher application submitted successfully',
            applicationId: application._id
        });
    } catch (error) {
        console.error('Teacher application error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting teacher application'
        });
    }
});

// @route   POST /api/forms/mentor-application
// @desc    Submit mentor application
// @access  Public
router.post('/mentor-application', async (req, res) => {
    try {
        const {
            mentorName,
            mentorEmail,
            mentorPhone,
            mentorQualification,
            mentorExperience,
            mentorSpecialization,
            mentorAchievements,
            mentorAvailability,
            mentorWhy
        } = req.body;

        const application = new MentorApplication({
            mentorName,
            mentorEmail,
            mentorPhone,
            mentorQualification,
            mentorExperience,
            mentorSpecialization,
            mentorAchievements,
            mentorAvailability,
            mentorWhy
        });

        await application.save();

        res.json({
            success: true,
            message: 'Mentor application submitted successfully',
            applicationId: application._id
        });
    } catch (error) {
        console.error('Mentor application error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting mentor application'
        });
    }
});

// @route   POST /api/forms/job-application
// @desc    Submit job application for careers
// @access  Public
router.post('/job-application', upload.single('applicantResume'), async (req, res) => {
    try {
        const {
            applicantName,
            applicantEmail,
            applicantPhone,
            position,
            currentLocation,
            totalExperience,
            currentCompany,
            noticePeriod,
            coverLetterText
        } = req.body;

        const application = new JobApplication({
            applicantName,
            applicantEmail,
            applicantPhone,
            position,
            currentLocation,
            totalExperience,
            currentCompany,
            noticePeriod,
            coverLetterText,
            resumeUrl: req.file ? req.file.path : null
        });

        await application.save();

        res.json({
            success: true,
            message: 'Job application submitted successfully',
            applicationId: application._id
        });
    } catch (error) {
        console.error('Job application error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting job application'
        });
    }
});

// @route   POST /api/forms/contact
// @desc    Submit contact form
// @access  Public
router.post('/contact', async (req, res) => {
    try {
        const {
            contactName,
            contactEmail,
            contactPhone,
            contactType,
            contactSubject,
            contactMessage
        } = req.body;

        const contact = new Contact({
            contactName,
            contactEmail,
            contactPhone,
            contactType,
            contactSubject,
            contactMessage
        });

        await contact.save();

        res.json({
            success: true,
            message: 'Contact form submitted successfully',
            contactId: contact._id
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting contact form'
        });
    }
});

// @route   POST /api/forms/consultation
// @desc    Book a consultation
// @access  Public
router.post('/consultation', async (req, res) => {
    try {
        const {
            consultationType,
            consultName,
            consultEmail,
            consultPhone,
            consultOrg,
            consultDate,
            consultTime,
            consultTopic
        } = req.body;

        const consultation = new Consultation({
            consultationType,
            consultName,
            consultEmail,
            consultPhone,
            consultOrg,
            consultDate,
            consultTime,
            consultTopic
        });

        await consultation.save();

        res.json({
            success: true,
            message: 'Consultation booked successfully',
            consultationId: consultation._id
        });
    } catch (error) {
        console.error('Consultation booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error booking consultation'
        });
    }
});

module.exports = router;
