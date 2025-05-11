const mongoose = require('mongoose');

const prisonerSchema = new mongoose.Schema({
    prisonerId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
    nationality: {
        type: String,
        required: true
    },
    crime: {
        type: String,
        required: true
    },
    sentence: {
        type: String,
        required: true
    },
    sentenceStartDate: {
        type: Date,
        required: true
    },
    caseNumber: {
        type: String,
        required: true
    },
    block: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D', 'E']
    },
    cellNumber: {
        type: String,
        required: true
    },
    securityLevel: {
        type: String,
        required: true,
        enum: ['minimum', 'medium', 'maximum']
    },
    specialRequirements: [{
        type: String,
        enum: ['medical', 'psychiatric', 'isolation', 'protection']
    }],
    medicalConditions: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    },
    prisonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prison',
        required: true
    },
    visitors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    punishments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Punishment'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Prisoner', prisonerSchema); 