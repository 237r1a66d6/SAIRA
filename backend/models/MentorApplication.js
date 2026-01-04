const mongoose = require('mongoose');

const MentorApplicationSchema = new mongoose.Schema({
    mentorName: {
        type: String,
        required: true
    },
    mentorEmail: {
        type: String,
        required: true
    },
    mentorPhone: {
        type: String,
        required: true
    },
    mentorQualification: {
        type: String,
        required: true
    },
    mentorExperience: {
        type: Number,
        required: true,
        min: 10
    },
    mentorSpecialization: {
        type: String,
        required: true
    },
    mentorAchievements: {
        type: String,
        required: true
    },
    mentorAvailability: {
        type: Number
    },
    mentorWhy: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['submitted', 'reviewing', 'interview', 'approved', 'rejected'],
        default: 'submitted'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MentorApplication', MentorApplicationSchema);
