const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
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
    role: {
        type: String,
        required: true,
        enum: ['Warden', 'Guard', 'Medical Staff', 'Counselor', 'Administrative']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    hireDate: {
        type: Date,
        required: true
    },
    prisonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prison',
        required: true
    },
    qualifications: {
        type: String
    },
    emergencyContact: {
        name: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema); 