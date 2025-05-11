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
    role: {
        type: String,
        required: true,
        enum: [
            'Correctional Officer',
            'Medical Staff',
            'Psychologist',
            'Social Worker',
            'Administrator',
            'Security Officer',
            'Counselor'
        ]
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
    hireDate: {
        type: Date,
        required: true
    },
    prisonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prison',
        required: true
    },
    department: {
        type: String
    },
    employeeId: {
        type: String
    },
    employmentType: {
        type: String,
        enum: ['full_time', 'part_time', 'contract', 'temporary']
    },
    salary: {
        type: Number
    },
    education: {
        type: String,
        enum: ['high_school', 'associate', 'bachelor', 'master', 'doctorate']
    },
    certifications: [{
        type: String
    }],
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String,
        email: String
    },
    notes: {
        type: String
    },
    specialRequirements: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema); 