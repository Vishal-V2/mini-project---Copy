const express = require('express');
const router = express.Router();
const Prison = require('../db/models/Prison');
const { body, validationResult } = require('express-validator');

// Get all prisons
router.get('/', async (req, res) => {
    try {
        const prisons = await Prison.find();
        res.json(prisons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single prison
router.get('/:id', async (req, res) => {
    try {
        const prison = await Prison.findById(req.params.id);
        if (!prison) {
            return res.status(404).json({ message: 'Prison not found' });
        }
        res.json(prison);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create prison
router.post('/', [
    body('name').notEmpty().trim(),
    body('location.address').notEmpty(),
    body('location.city').notEmpty(),
    body('location.state').notEmpty(),
    body('location.zipCode').notEmpty(),
    body('capacity').isNumeric(),
    body('securityLevel').isIn(['Minimum', 'Medium', 'Maximum'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const prison = new Prison(req.body);
    try {
        const newPrison = await prison.save();
        res.status(201).json(newPrison);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update prison
router.put('/:id', async (req, res) => {
    try {
        const prison = await Prison.findById(req.params.id);
        if (!prison) {
            return res.status(404).json({ message: 'Prison not found' });
        }

        Object.assign(prison, req.body);
        const updatedPrison = await prison.save();
        res.json(updatedPrison);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete prison
router.delete('/:id', async (req, res) => {
    try {
        const prison = await Prison.findById(req.params.id);
        if (!prison) {
            return res.status(404).json({ message: 'Prison not found' });
        }

        await prison.remove();
        res.json({ message: 'Prison deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 