const express = require('express');
const router = express.Router();
const Prison = require('../models/Prison');
const Prisoner = require('../models/Prisoner');
const Staff = require('../models/Staff');
const Visit = require('../models/Visit');
const { body, validationResult } = require('express-validator');

// Prison routes
router.get('/prisons', async (req, res) => {
    try {
        console.log('Fetching prisons...');
        const prisons = await Prison.find();
        console.log('Found prisons:', prisons);
        res.json(prisons);
    } catch (err) {
        console.error('Error fetching prisons:', err);
        res.status(500).json({ message: err.message });
    }
});

// Prisoner routes
router.get('/prisoners', async (req, res) => {
    try {
        console.log('Fetching prisoners...');
        const prisoners = await Prisoner.find().populate('prisonId');
        console.log('Found prisoners:', prisoners);
        res.json(prisoners);
    } catch (err) {
        console.error('Error fetching prisoners:', err);
        res.status(500).json({ message: err.message });
    }
});

// Staff routes
router.get('/staff', async (req, res) => {
    try {
        console.log('Fetching staff...');
        const staff = await Staff.find();
        console.log('Raw staff data:', JSON.stringify(staff, null, 2));
        
        // Populate prison data
        const populatedStaff = await Staff.find().populate('prisonId');
        console.log('Populated staff data:', JSON.stringify(populatedStaff, null, 2));
        
        res.json(populatedStaff);
    } catch (err) {
        console.error('Error fetching staff:', err);
        res.status(500).json({ message: err.message });
    }
});

// Visit routes
router.get('/visits', async (req, res) => {
    try {
        console.log('Fetching visits...');
        const visits = await Visit.find().populate('prisonerId');
        console.log('Found visits:', visits);
        res.json(visits);
    } catch (err) {
        console.error('Error fetching visits:', err);
        res.status(500).json({ message: err.message });
    }
});

// Add new staff member
router.post('/staff', [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('role').isIn([
        'Correctional Officer',
        'Medical Staff',
        'Psychologist',
        'Social Worker',
        'Administrator',
        'Security Officer',
        'Counselor'
    ]).withMessage('Valid role is required'),
    body('hireDate').isDate().withMessage('Valid hire date is required'),
    body('department').optional(),
    body('employeeId').optional(),
    body('employmentType').optional().isIn(['full_time', 'part_time', 'contract', 'temporary']),
    body('salary').optional().isNumeric(),
    body('education').optional().isIn(['high_school', 'associate', 'bachelor', 'master', 'doctorate']),
    body('certifications').optional(),
    body('emergencyContact').optional(),
    body('notes').optional(),
    body('specialRequirements').optional()
], async (req, res) => {
    console.log('Received staff data:', JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Find the first available prison
        const prison = await Prison.findOne();
        console.log('Found prison:', prison);
        
        if (!prison) {
            console.log('No prison found');
            return res.status(400).json({ message: 'No prison found' });
        }

        // Create new staff member with prison ID
        const staffData = {
            ...req.body,
            prisonId: prison._id
        };
        console.log('Creating staff with data:', JSON.stringify(staffData, null, 2));

        const newStaff = new Staff(staffData);
        const savedStaff = await newStaff.save();
        
        console.log('New staff member added:', JSON.stringify(savedStaff, null, 2));
        res.status(201).json(savedStaff);
    } catch (error) {
        console.error('Error adding staff member:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/welcome', (req, res) => {
    console.log(`Request received: ${req.method} ${req.path}`);
    res.json({ message: 'Welcome to the Prison Management API Service!' });
});

module.exports = router;
