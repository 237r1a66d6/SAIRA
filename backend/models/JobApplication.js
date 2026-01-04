const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
    applicantName: {
        type: String,
        required: true
    },
    applicantEmail: {
        type: String,
        required: true
    },
    applicantPhone: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    currentLocation: {
        type: String,
        required: true
    },
    totalExperience: {
        type: Number,
        required: true
    },
    currentCompany: {
        type: String
    },
    noticePeriod: {
        type: Number
    },
    coverLetterText: {
        type: String,
        required: true
    },
    resumeUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['submitted', 'reviewing', 'interview', 'offered', 'hired', 'rejected'],
        default: 'submitted'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
