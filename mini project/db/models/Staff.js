const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    staffId: {
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
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Warden', 'Deputy Warden', 'Correctional Officer', 'Medical Staff', 'Counselor', 'Administrative Staff'],
        required: true
    },
    prison: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prison',
        required: true
    },
    department: {
        type: String,
        required: true
    },
    shift: {
        type: String,
        enum: ['Morning', 'Afternoon', 'Night'],
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Suspended', 'Terminated'],
        default: 'Active'
    },
    joiningDate: {
        type: Date,
        required: true
    },
    qualifications: [{
        degree: String,
        institution: String,
        year: Number
    }],
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
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
staffSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.models.Staff || mongoose.model('Staff', staffSchema);
