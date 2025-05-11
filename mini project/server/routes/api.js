const express = require('express');
const router = express.Router();
const Prison = require('../models/Prison');
const Prisoner = require('../models/Prisoner');
const Staff = require('../models/Staff');
const Visit = require('../models/Visit');

// Prison routes
router.get('/prisons', async (req, res) => {
  try {
    const prisons = await Prison.find();
    res.json(prisons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Prisoner routes
router.get('/prisoners', async (req, res) => {
  try {
    const prisoners = await Prisoner.find();
    res.json(prisoners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Staff routes
router.get('/staff', async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new prisoner
router.post('/prisoners', async (req, res) => {
  try {
    // Find the first available prison (or adjust logic as needed)
    const prison = await Prison.findOne();
    if (!prison) return res.status(400).json({ message: 'No prison found' });

    // Build prisoner data from request body and add prisonId
    const prisonerData = {
      ...req.body,
      prisonId: prison._id
    };

    const newPrisoner = new Prisoner(prisonerData);
    const savedPrisoner = await newPrisoner.save();
    res.status(201).json(savedPrisoner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Staff routes
router.get('/staff', async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Visit routes
router.get('/visits', async (req, res) => {
  try {
    const visits = await Visit.find();
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

