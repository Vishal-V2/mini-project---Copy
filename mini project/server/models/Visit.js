const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    prisonerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prisoner',
        required: true
    },
    visitorName: {
        type: String,
        required: true
    },
    visitorId: {
        type: String,
        required: true
    },
    relationship: {
        type: String,
        required: true
    },
    visitType: {
        type: String,
        required: true,
        enum: ['Regular Visit', 'Legal Visit', 'Family Visit', 'Special Visit']
    },
    visitDate: {
        type: Date,
        required: true
    },
    visitTime: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true,
        enum: ['30', '60', '90', '120']
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled']
    },
    purpose: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema); 