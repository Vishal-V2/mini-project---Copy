const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

// Admin login route
router.post('/admin/login', async (req, res) => {
    try {
        const { adminId, password } = req.body;

        // Find admin by adminId
        const admin = await Admin.findOne({ adminId });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid admin ID or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid admin ID or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, adminId: admin.adminId, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            admin: {
                id: admin._id,
                adminId: admin.adminId,
                name: admin.name,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Visitor OTP request route
router.post('/visitor/request-otp', async (req, res) => {
    try {
        const { phoneNumber, aadhaarNumber } = req.body;

        // Find user by phone number and Aadhaar number
        const user = await User.findOne({ phoneNumber, aadhaarNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in user document (in production, you would send this via SMS)
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
        await user.save();

        // In production, send OTP via SMS service
        console.log(`OTP for ${phoneNumber}: ${otp}`);

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('OTP request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Visitor login route
router.post('/visitor/login', async (req, res) => {
    try {
        const { phoneNumber, aadhaarNumber, otp } = req.body;

        // Find user by phone number and Aadhaar number
        const user = await User.findOne({ phoneNumber, aadhaarNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify OTP
        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, phoneNumber: user.phoneNumber, role: 'visitor' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                role: 'visitor'
            }
        });
    } catch (error) {
        console.error('Visitor login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 