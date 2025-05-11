const mongoose = require('mongoose');

const punishmentSchema = new mongoose.Schema({
    punishmentId: {
        type: String,
        required: true,
        unique: true
    },
    prisoner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prisoner',
        required: true
    },
    prison: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prison',
        required: true
    },
    article: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Warning', 'Restriction', 'Isolation', 'Loss of Privileges', 'Extended Sentence'],
        required: true
    },
    duration: {
        type: Number,  // in days
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'Active'
    },
    notes: String,
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
punishmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.models.Punishment || mongoose.model('Punishment', punishmentSchema);
