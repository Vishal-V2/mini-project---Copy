const mongoose = require('mongoose');

const prisonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        }
    },
    capacity: {
        type: Number,
        required: true
    },
    currentOccupancy: {
        type: Number,
        default: 0
    },
    blocks: [{
        name: {
            type: String,
            required: true
        },
        capacity: {
            type: Number,
            required: true
        },
        currentOccupancy: {
            type: Number,
            default: 0
        }
    }],
    securityLevel: {
        type: String,
        enum: ['Minimum', 'Medium', 'Maximum'],
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Under Maintenance'],
        default: 'Active'
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
prisonSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.models.Prison || mongoose.model('Prison', prisonSchema);
