const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    qualification: {
        type: String,
        required: true,
        enum: ['B.Ed', 'M.Ed', 'B.A', 'M.A', 'B.Sc', 'M.Sc', 'PhD', 'Other']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    registeredDate: {
        type: Date,
        default: Date.now
    },
    progress: {
        type: Number,
        default: 0
    },
    enrolledCourses: {
        type: Number,
        default: 0
    },
    completedCourses: {
        type: Number,
        default: 0
    },
    inProgressCourses: {
        type: Number,
        default: 0
    },
    courses: [{
        courseName: String,
        progress: Number,
        enrolledDate: Date,
        status: {
            type: String,
            enum: ['enrolled', 'in-progress', 'completed'],
            default: 'enrolled'
        }
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
