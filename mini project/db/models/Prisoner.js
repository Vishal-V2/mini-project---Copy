const mongoose = require('mongoose');

const prisonerSchema = new mongoose.Schema({
    prisonerId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    prison: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prison',
        required: true
    },
    block: {
        type: String,
        required: true
    },
    cell: {
        type: String,
        required: true
    },
    crimeDetails: [{
        crime: {
            type: String,
            required: true
        },
        article: {
            type: String,
            required: true
        },
        sentence: {
            type: Number,  // in months
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['Normal', 'Restricted', 'Isolation', 'Released'],
        default: 'Normal'
    },
    medicalHistory: [{
        condition: String,
        diagnosis: String,
        treatment: String,
        date: Date
    }],
    visitors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visitor'
    }],
    punishments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Punishment'
    }],
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
prisonerSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.models.Prisoner || mongoose.model('Prisoner', prisonerSchema);
