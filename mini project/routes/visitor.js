const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const Visit = require('../models/Visit');
const auth = require('../middleware/auth');

// Get visitor dashboard data
router.get('/dashboard', auth, async (req, res) => {
    try {
        // Get upcoming visits for the visitor
        const upcomingVisits = await Visit.find({
            visitorId: req.user._id,
            visitDate: { $gte: new Date() }
        })
        .populate('prisonerId', 'name')
        .sort({ visitDate: 1 })
        .limit(5);

        // Format the visits data
        const formattedVisits = upcomingVisits.map(visit => ({
            prisonerName: visit.prisonerId.name,
            visitDate: visit.visitDate,
            visitTime: visit.visitTime,
            status: visit.status
        }));

        res.json({
            upcomingVisits: formattedVisits
        });
    } catch (error) {
        console.error('Error fetching visitor dashboard:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 