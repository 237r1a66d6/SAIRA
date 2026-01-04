const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
    consultationType: {
        type: String,
        required: true,
        enum: ['school', 'teacher']
    },
    consultName: {
        type: String,
        required: true
    },
    consultEmail: {
        type: String,
        required: true
    },
    consultPhone: {
        type: String,
        required: true
    },
    consultOrg: {
        type: String
    },
    consultDate: {
        type: Date,
        required: true
    },
    consultTime: {
        type: String,
        required: true
    },
    consultTopic: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
        default: 'scheduled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Consultation', ConsultationSchema);
