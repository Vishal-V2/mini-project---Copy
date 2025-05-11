const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    visitorId: {
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
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    idProof: {
        type: {
            type: String,
            enum: ['Passport', 'Driver License', 'National ID', 'Other'],
            required: true
        },
        number: {
            type: String,
            required: true
        }
    },
    relationship: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Approved', 'Pending', 'Blacklisted'],
        default: 'Pending'
    },
    visits: [{
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
        date: {
            type: Date,
            required: true
        },
        timeSlot: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Scheduled', 'Completed', 'Cancelled', 'No-Show'],
            default: 'Scheduled'
        },
        notes: String
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
visitorSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);
