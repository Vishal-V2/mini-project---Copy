const mongoose = require('mongoose');

const prisonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Maximum Security', 'High Security', 'Medium Security', 'Low Security']
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Prison', prisonSchema); 