const mongoose = require('mongoose');

const TeacherApplicationSchema = new mongoose.Schema({
    teacherName: {
        type: String,
        required: true
    },
    teacherEmail: {
        type: String,
        required: true
    },
    teacherPhone: {
        type: String,
        required: true
    },
    teacherQualification: {
        type: String,
        required: true
    },
    teacherSubject: {
        type: String,
        required: true
    },
    teacherExperience: {
        type: Number,
        required: true
    },
    preferredLocation: {
        type: String,
        required: true
    },
    currentSalary: {
        type: String
    },
    coverLetter: {
        type: String
    },
    resumeUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['submitted', 'reviewing', 'shortlisted', 'placed', 'rejected'],
        default: 'submitted'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TeacherApplication', TeacherApplicationSchema);
