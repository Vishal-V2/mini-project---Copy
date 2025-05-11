const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    visitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visitor',
        required: true
    },
    prisonerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prisoner',
        required: true
    },
    visitDate: {
        type: Date,
        required: true
    },
    visitTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    purpose: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true,
        min: 15,
        max: 60
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
visitSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Visit', visitSchema); 