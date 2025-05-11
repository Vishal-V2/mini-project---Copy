const express = require('express');
const router = express.Router();
const Prisoner = require('../models/Prisoner');
const { body, validationResult } = require('express-validator');
const Prison = require('../models/Prison');

// Get all prisoners
router.get('/', async (req, res) => {
    try {
        const prisoners = await Prisoner.find()
            .populate('prisonId', 'name')
            .populate('visitors', 'name')
            .populate('punishments', 'type status');
        res.json(prisoners);
    } catch (error) {
        console.error('Error fetching prisoners:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get single prisoner
router.get('/:id', async (req, res) => {
    try {
        const prisoner = await Prisoner.findById(req.params.id)
            .populate('prisonId', 'name')
            .populate('visitors', 'name')
            .populate('punishments', 'type status');
        if (!prisoner) {
            return res.status(404).json({ message: 'Prisoner not found' });
        }
        res.json(prisoner);
    } catch (error) {
        console.error('Error fetching prisoner:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create prisoner
router.post('/', [
    body('prisonerId').notEmpty().withMessage('Prisoner ID is required'),
    body('firstName').notEmpty().trim().withMessage('First name is required'),
    body('lastName').notEmpty().trim().withMessage('Last name is required'),
    body('dateOfBirth').isDate().withMessage('Valid date of birth is required'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
    body('nationality').notEmpty().withMessage('Nationality is required'),
    body('crime').notEmpty().withMessage('Crime details are required'),
    body('sentence').isString().withMessage('Sentence must be a string'),
    body('sentenceStartDate').isDate().withMessage('Valid sentence start date is required'),
    body('caseNumber').notEmpty().withMessage('Case number is required'),
    body('block').isIn(['A', 'B', 'C', 'D', 'E']).withMessage('Valid block is required'),
    body('cellNumber').notEmpty().withMessage('Cell number is required'),
    body('securityLevel').isIn(['minimum', 'medium', 'maximum']).withMessage('Valid security level is required')
    // specialRequirements, medicalConditions, notes are optional
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Find the first available prison (or adjust logic as needed)
        const prison = await Prison.findOne();
        if (!prison) return res.status(400).json({ message: 'No prison found' });

        // Add prisonId to the request body
        const prisonerData = { ...req.body, prisonId: prison._id };

        const prisoner = new Prisoner(prisonerData);
        const newPrisoner = await prisoner.save();
        res.status(201).json(newPrisoner);
    } catch (error) {
        console.error('Error creating prisoner:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update prisoner
router.put('/:id', async (req, res) => {
    try {
        const prisoner = await Prisoner.findById(req.params.id);
        if (!prisoner) {
            return res.status(404).json({ message: 'Prisoner not found' });
        }

        Object.assign(prisoner, req.body);
        const updatedPrisoner = await prisoner.save();
        res.json(updatedPrisoner);
    } catch (error) {
        console.error('Error updating prisoner:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete prisoner
router.delete('/:id', async (req, res) => {
    try {
        const prisoner = await Prisoner.findById(req.params.id);
        if (!prisoner) {
            return res.status(404).json({ message: 'Prisoner not found' });
        }

        await Prisoner.deleteOne({ _id: req.params.id });
        res.json({ message: 'Prisoner deleted successfully' });
    } catch (error) {
        console.error('Error deleting prisoner:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get prisoners by prison
router.get('/prison/:prisonId', async (req, res) => {
    try {
        const prisoners = await Prisoner.find({ prisonId: req.params.prisonId })
            .populate('prisonId', 'name')
            .populate('visitors', 'name')
            .populate('punishments', 'type status');
        res.json(prisoners);
    } catch (error) {
        console.error('Error fetching prisoners by prison:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 